#!/usr/bin/env perl
# PLANSEL Global Wine Monitor: Datenimport. Nur Perl-Kernmodule und curl, keine Schlüssel nötig.
# Aufruf: perl update.pl <Ordner data>   Fällt eine Quelle aus, bleibt ihr letzter gültiger Stand erhalten.
use strict; use warnings; use utf8; use JSON::PP; use POSIX qw(strftime); use Encode;
binmode STDOUT, ":utf8"; my $D = shift // 'monitor/data'; my $J = JSON::PP->new->utf8->canonical;
my $now = time; my $iso = strftime('%Y-%m-%dT%H:%M:%SZ', gmtime $now); my $Y = (gmtime)[5] + 1900;
sub slurp { my $f = shift; open my $i, '<:raw', $f or return; local $/; <$i> }
my $old = eval { $J->decode(slurp("$D/data.json") // '{}') } || {};
my %out = (generated => $iso, blocks => {}, status => {}); my @log;
sub get { my ($u) = @_; for my $try (1 .. 3) {
  open my $p, '-|', 'curl', '-sL', '--compressed', '-m', '60', '-A', 'PlanselWineMonitor/1.0 (+https://plansel.vercel.app/index4.html)', '-w', "\n%{http_code}", $u or die 'curl';
  binmode $p; local $/; my $b = <$p>; close $p; my ($c) = $b =~ /\n(\d+)\z/; $b =~ s/\n\d+\z//; return $b if ($c // 0) == 200; die "HTTP ".($c//0) if $try == 3; sleep 4 * $try } }
sub js { $J->decode(get(shift)) }
# Ein Block je Quelle: ttl in Minuten, Prüfung auf Plausibilität, Rückfall auf alten Stand
sub block { my ($id, $name, $url, $ttl, $code) = @_; my $s = $old->{status}{$id}; my $b = $old->{blocks}{$id};
  if ($b && $s && $s->{state} eq 'ok' && $s->{ts} && $now - $s->{ts} < $ttl * 60 && !$ENV{FORCE}) { $out{blocks}{$id} = $b; $out{status}{$id} = $s; return }
  my $r = eval { $code->() };
  if ($r && !$@) { $out{blocks}{$id} = $r; $out{status}{$id} = { name => $name, url => $url, state => 'ok', ts => $now, last => $iso, ttl => $ttl, period => $r->{period} // '', err => '' } }
  else { my $e = $@ || 'leer'; $e =~ s/ at \S+ line.*//s; push @log, "$iso $id: $e"; $out{blocks}{$id} = $b if $b;
    $out{status}{$id} = { name => $name, url => $url, state => $b ? 'stale' : 'down', ts => ($s ? $s->{ts} : 0) || 0, last => ($s ? $s->{last} : '') || '', ttl => $ttl, period => $b ? $b->{period} // '' : '', err => $e, tried => $iso } } }
sub rng { my ($v, $lo, $hi, $n) = @_; die "unplausibel $n: ".($v // 'leer') unless defined $v && $v >= $lo && $v <= $hi; $v + 0 }
sub wb { my ($c, $i) = @_; my $d = js("https://api.worldbank.org/v2/country/$c/indicator/$i?format=json&per_page=80"); [ sort { $a->[0] <=> $b->[0] } map { [ $_->{date} + 0, $_->{value} + 0 ] } grep { defined $_->{value} } @{ $d->[1] } ] }
block('worldbank', 'World Bank Open Data', 'https://data.worldbank.org/', 1440, sub {
  my $p = wb('WLD', 'SP.POP.TOTL'); rng($p->[-1][1], 7.5e9, 1e10, 'Bevölkerung'); my $bi = wb('WLD', 'SP.DYN.CBRT.IN'); my $de = wb('WLD', 'SP.DYN.CDRT.IN');
  rng($bi->[-1][1], 8, 40, 'Geburtenrate'); rng($de->[-1][1], 4, 30, 'Sterberate');
  return { pop => $p, birth => $bi->[-1], death => $de->[-1], tourPT => wb('PRT', 'ST.INT.ARVL'), popPT => wb('PRT', 'SP.POP.TOTL')->[-1], period => $p->[-1][0] } });
block('popc', 'World Bank: Bevölkerung je Land', 'https://data.worldbank.org/indicator/SP.POP.TOTL', 10080, sub {
  my $d = js('https://api.worldbank.org/v2/country/PRT;FRA;ITA;DEU;GBR;ESP;RUS;ARG;AUS;USA/indicator/SP.POP.TOTL?format=json&mrnev=1&per_page=50'); my %h = map { $_->{country}{id} => [ $_->{date} + 0, $_->{value} + 0 ] } @{ $d->[1] };
  rng(scalar keys %h, 9, 10, 'Länder'); rng($h{PT}[1], 9e6, 12e6, 'Portugal'); return { c => \%h, period => $h{PT}[0] } });
block('fao', 'FAO (via Our World in Data)', 'https://ourworldindata.org/grapher/wine-production', 1440, sub {
  my $c = get('https://ourworldindata.org/grapher/wine-production.csv?csvType=full&useColumnShortNames=true'); my %s;
  for (split /\r?\n/, $c) { my @f = split /,/; next unless @f == 4 && $f[2] =~ /^\d{4}$/; push @{ $s{ $f[0] eq 'World' ? 'World' : $f[1] } }, [ $f[2] + 0, $f[3] + 0 ] }
  rng($s{World}[-1][1], 1.5e7, 4.5e7, 'FAO Welt'); my $y = $s{World}[-1][0];
  my @t = sort { $b->[1] <=> $a->[1] } map { [ $_, $s{$_}[-1][1] ] } grep { /^[A-Z]{3}$/ && $s{$_}[-1][0] == $y } keys %s;
  return { world => $s{World}, PT => $s{PRT}, top => [ @t[0 .. 14] ], period => $y } });
sub es { my ($q) = @_; my $d = js("https://ec.europa.eu/eurostat/api/$q"); my (@r, @st); my @id = @{ $d->{id} }; my @sz = @{ $d->{size} }; my $m = 1;
  for my $i (reverse 0 .. $#id) { $st[$i] = $m; $m *= $sz[$i] } my %rev; for my $k (@id) { my $x = $d->{dimension}{$k}{category}{index}; $rev{$k}{ $x->{$_} } = $_ for keys %$x }
  for my $k (keys %{ $d->{value} }) { my $n = $k; my %h; for my $i (0 .. $#id) { $h{ $id[$i] } = $rev{ $id[$i] }{ int($n / $st[$i]) }; $n %= $st[$i] } push @r, { %h, v => $d->{value}{$k} + 0 } } (\@r, $d->{updated}) }
block('eurotour', 'Eurostat: Tourismus', 'https://ec.europa.eu/eurostat/databrowser/view/tour_occ_arnat/default/table', 720, sub {
  my ($r, $u) = es('dissemination/statistics/1.0/data/tour_occ_arnat?geo=PT&unit=NR&c_resid=TOTAL&c_resid=FOR&nace_r2=I551-I553&lang=en'); my %s; push @{ $s{ $_->{c_resid} } }, [ $_->{time} + 0, $_->{v} ] for @$r; $_ = [ sort { $a->[0] <=> $b->[0] } @$_ ] for values %s; rng($s{TOTAL}[-1][1], 5e6, 1e8, 'Gäste PT');
  my ($n) = es('dissemination/statistics/1.0/data/tour_occ_nim?geo=PT&unit=NR&c_resid=TOTAL&nace_r2=I551-I553&lang=en&sinceTimePeriod=2019-01'); my @n = sort { $a->[0] cmp $b->[0] } map { [ $_->{time}, $_->{v} ] } @$n;
  my ($a) = es('dissemination/statistics/1.0/data/tour_occ_arm?geo=PT&unit=NR&c_resid=TOTAL&nace_r2=I551-I553&lang=en&sinceTimePeriod=2024-01'); my @a = sort { $a->[0] cmp $b->[0] } map { [ $_->{time}, $_->{v} ] } @$a;
  my ($h) = es('dissemination/statistics/1.0/data/tour_cap_nat?geo=PT&nace_r2=I551&accomunit=ESTBL&unit=NR&lang=en&sinceTimePeriod=2015'); my @h = sort { $a->[0] <=> $b->[0] } map { [ $_->{time} + 0, $_->{v} ] } @$h;
  return { arr => $s{TOTAL}, foreign => $s{FOR} || [], nights => \@n, arrM => \@a, hotels => \@h, updated => $u, period => $s{TOTAL}[-1][0] } });
block('euroorg', 'Eurostat: Bio-Anbau', 'https://ec.europa.eu/eurostat/databrowser/view/org_cropar/default/table', 1440, sub {
  my ($r, $u) = es('dissemination/statistics/1.0/data/org_cropar?geo=PT&crops=W1000&unit=HA&agprdmet=TOTAL&lang=en'); my @s = sort { $a->[0] <=> $b->[0] } map { [ $_->{time} + 0, $_->{v} ] } @$r; die 'keine Werte' unless @s; return { vine => \@s, updated => $u, period => $s[-1][0] } });
block('comext', 'Eurostat Comext: Außenhandel', 'https://ec.europa.eu/eurostat/comext/newxtweb/', 720, sub {
  my $p = join '', map { "&partner=$_" } qw(WORLD US FR GB BR DE CA AO NL BE CH PL SE ES LU DK CN); my $base = 'comext/dissemination/statistics/1.0/data/DS-045409?reporter=PT&product=2204&flow=2&indicators=VALUE_IN_EUROS&indicators=QUANTITY_IN_100KG&lang=en';
  my ($r, $u) = es("$base&freq=A$p&sinceTimePeriod=2005"); my %e; $e{ $_->{partner} }{ $_->{indicators} =~ /VALUE/ ? 'eur' : 'q' }{ $_->{time} } = $_->{v} for @$r;
  my ($mo) = es("$base&freq=M&partner=WORLD&sinceTimePeriod=" . ($Y - 2) . '-01'); my %m; $m{ $_->{time} }[ $_->{indicators} =~ /VALUE/ ? 0 : 1 ] = $_->{v} for @$mo;
  my @y = sort keys %{ $e{WORLD}{eur} }; my ($full) = reverse grep { $_ < $Y } @y; rng($e{WORLD}{eur}{$full}, 3e8, 3e9, 'Export PT');
  return { world => [ map { [ $_ + 0, $e{WORLD}{eur}{$_}, $e{WORLD}{q}{$_} // 0 ] } grep { $_ <= $full } @y ], partners => [ sort { $b->[1] <=> $a->[1] } map { [ $_, $e{$_}{eur}{$full} // 0, $e{$_}{q}{$full} // 0, $e{$_}{eur}{ $full - 1 } // 0 ] } grep { $_ ne 'WORLD' } keys %e ], monthly => [ map { [ $_, $m{$_}[0] // 0, $m{$_}[1] // 0 ] } sort keys %m ], year => $full + 0, updated => $u, period => $full } });
my %ctry = (36,'AU',40,'AT',32,'AR',56,'BE',76,'BR',124,'CA',152,'CL',156,'CN',203,'CZ',208,'DK',251,'FR',268,'GE',276,'DE',300,'GR',344,'HK',348,'HU',372,'IE',380,'IT',381,'IT',392,'JP',410,'KR',440,'LT',442,'LU',498,'MD',528,'NL',554,'NZ',579,'NO',616,'PL',620,'PT',642,'RO',702,'SG',710,'ZA',724,'ES',752,'SE',757,'CH',826,'GB',842,'US',484,'MX',643,'RU');
block('ecb', 'Europäische Zentralbank', 'https://data.ecb.europa.eu/', 360, sub {
  my $c = get('https://data-api.ecb.europa.eu/service/data/EXR/D.USD+GBP+BRL+CHF.EUR.SP00.A?lastNObservations=1&format=csvdata&detail=dataonly'); my %r; my $d; for (split /\r?\n/, $c) { my @f = split /,/; next unless $f[0] =~ /^EXR/; $r{ $f[2] } = $f[7] + 0; $d = $f[6] } rng($r{USD}, .7, 1.8, 'USD'); return { rates => \%r, date => $d, period => $d } });
block('comtrade', 'UN Comtrade', 'https://comtradeplus.un.org/', 4320, sub {
  my %o; for my $y ($Y - 1, $Y - 2) { my $ok = 1; for my $f ('X', 'M') { sleep 3; my $d = js("https://comtradeapi.un.org/public/v1/preview/C/A/HS?period=$y&cmdCode=2204&flowCode=$f&partnerCode=0&partner2Code=0&customsCode=C00&motCode=0"); my %s; $s{ $_->{reporterCode} } = $_->{primaryValue} for @{ $d->{data} }; my @l = sort { $b->[1] <=> $a->[1] } map { [ $ctry{$_}, $s{$_} + 0 ] } grep { $ctry{$_} } keys %s; my %has = map { $_->[0] => 1 } @l; $ok = 0 if @l < 20 || grep { !$has{$_} } qw(IT FR ES PT DE US); $o{$f} = [ @l[0 .. ($#l < 14 ? $#l : 14)] ] } if ($ok) { $o{year} = $y; last } }
  die 'kein vollständiges Jahr' unless $o{year}; rng($o{X}[0][1], 3e9, 3e10, 'Export Spitze'); return { %o, period => $o{year} } });
block('ipma', 'IPMA: Station Montemor-o-Novo', 'https://www.ipma.pt/pt/otempo/obs.superficie/', 30, sub {
  my $o = js('https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json'); my @h; for my $t (sort keys %$o) { my $s = $o->{$t}{'1210846'} or next; next if $s->{temperatura} < -50; push @h, [ $t, map { $s->{$_} > -90 ? $s->{$_} + 0 : undef } qw(temperatura humidade precAcumulada intensidadeVentoKM radiacao) ] }
  die 'Station ohne Werte' unless @h; rng($h[-1][1], -15, 52, 'Temperatur'); return { hours => \@h, period => $h[-1][0] } });
block('metno', 'MET Norway: Vorhersage', 'https://api.met.no/', 60, sub {
  my $o = js('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=38.645&lon=-8.199'); my %d; my $cur;
  for my $t (@{ $o->{properties}{timeseries} }) { my $x = $t->{data}{instant}{details}; my $day = substr $t->{time}, 0, 10; my $n = $t->{data}{next_1_hours} || $t->{data}{next_6_hours}; $cur //= { sym => $n->{summary}{symbol_code}, cloud => $x->{cloud_area_fraction}, wind => $x->{wind_speed} * 3.6, hum => $x->{relative_humidity}, t => $x->{air_temperature} };
    my $h = $d{$day} ||= { min => 99, max => -99, rain => 0, wind => 0 }; $h->{min} = $x->{air_temperature} if $x->{air_temperature} < $h->{min}; $h->{max} = $x->{air_temperature} if $x->{air_temperature} > $h->{max}; $h->{wind} = $x->{wind_speed} * 3.6 if $x->{wind_speed} * 3.6 > $h->{wind};
    if (my $p = $t->{data}{next_1_hours}) { $h->{rain} += $p->{details}{precipitation_amount} // 0 } elsif ($p = $t->{data}{next_6_hours}) { $h->{rain} += $p->{details}{precipitation_amount} // 0 } $h->{sym} = $n->{summary}{symbol_code} if $n && substr($t->{time}, 11, 2) == 12; $h->{sym} //= $n->{summary}{symbol_code} if $n }
  my @k = (sort keys %d)[0 .. 6]; return { now => $cur, days => [ map { [ $_, map { sprintf('%.1f', $_) + 0 } @{ $d{$_} }{qw(min max rain wind)} ] } @k ], sym => [ map { $d{$_}{sym} } @k ], period => $k[0] } });
block('nasa', 'NASA POWER: Klima und Boden', 'https://power.larc.nasa.gov/', 720, sub {
  my $f = sub { strftime('%Y%m%d', gmtime($now - 86400 * shift)) }; my $o = js('https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,T2M,GWETROOT,ALLSKY_SFC_SW_DWN&community=AG&longitude=-8.199&latitude=38.645&start=' . $f->(400) . '&end=' . $f->(2) . '&format=JSON'); my $p = $o->{properties}{parameter}; my @r;
  for my $k (sort keys %{ $p->{T2M} }) { push @r, [ $k, map { my $v = $p->{$_}{$k}; defined $v && $v > -900 ? $v + 0 : undef } qw(PRECTOTCORR T2M GWETROOT ALLSKY_SFC_SW_DWN) ] } pop @r while @r && !defined $r[-1][2]; die 'zu wenig Tage' if @r < 300; return { days => \@r, period => $r[-1][0] } });
my @feeds = (['OIV','https://www.oiv.int/rss.xml','en'],['IVV','https://www.ivv.gov.pt/rss','pt'],['Vitisphere','https://www.vitisphere.com/rss','fr'],['Revista de Vinhos','https://www.revistadevinhos.pt/rss','pt'],['Grandes Escolhas','https://grandesescolhas.com/feed/','pt'],['Vida Rural','https://vidarural.pt/feed/','pt'],['Agroportal','https://www.agroportal.pt/feed/','pt'],['Decanter','https://www.decanter.com/feed/','en'],['EU Agriculture','https://agriculture.ec.europa.eu/node/2/rss_en','en'],['The Portugal News','https://www.theportugalnews.com/rss','en']);
my @cat = (['ai','intelig[êe]ncia artificial|artificial intelligence|\bIA\b|\bAI\b|rob[oóô]|drone'],['climate','clima|seca|drought|gel\b|frost|inc[eê]nd|wildfire|chuva|weather|s[eé]cheresse|temp[eé]rature'],['law','regulament|regulation|\blei\b|\blaw\b|tarif|tariff|labelling|rotul|policy|polit|directive|imposto|\btax'],['sustain','sustent|sustain|biol[oó]g|organic|\bbio\b|ambient|carbon'],['trade','export|import|mercado|market|trade|com[eé]rcio|vendas|sales|pre[çc]o|price|prix'],['production','produ[çc]|production|vindima|harvest|vendang|colheita|vinha|vineyard|vigne'],['tourism','enoturis|turis|tourism|hotel']);
my $wine = qr/vinho|vinha|vin[ií]col|viticul|vindima|enoturis|\bwines?\b|winer|vineyard|grape|\bvins?\b|vigne|vitivin|champagne|\buva|adega|alentej|oiv|\bivv\b/i;
block('news', 'Nachrichten (RSS)', 'https://www.oiv.int/', 55, sub { my @n; my %st; my %seen;
  for my $f (@feeds) { my $x = eval { decode('UTF-8', get($f->[1])) }; unless ($x) { $st{ $f->[0] } = 'Fehler'; next } my $c = 0;
    while ($x =~ m{<item\b.*?>(.*?)</item>}sg) { my $i = $1; my ($t) = $i =~ m{<title>(.*?)</title>}s; my ($l) = $i =~ m{<link>(.*?)</link>}s; my ($d) = $i =~ m{<pubDate>(.*?)</pubDate>}s; next unless $t && $l; my ($s) = $i =~ m{<description>(.*?)</description>}s; $s //= '';
      for ($t, $l, $s) { s/<!\[CDATA\[(.*?)\]\]>/$1/sg; s/&#(\d+);/chr $1/ge; s/&#x([0-9a-f]+);/chr hex $1/gie; s/&lt;/</g; s/&gt;/>/g; s/<[^>]*>//g; s/&quot;/"/g; s/&apos;|&rsquo;/'/g; s/&nbsp;/ /g; s/&amp;/&/g; s/^\s+|\s+$//g; s/\s+/ /g }
      next unless $l =~ m{^https?://} && !$seen{$l}++; next unless "$t $l" =~ $wine || ($f->[0] =~ /^(OIV|IVV|Vitisphere|Revista|Grandes|Decanter)/ && $f->[0] ne 'OIV'); next if $f->[0] eq 'OIV' && $l =~ m{/agenda/|oiv\.int/?$};
      my $k = 'market'; for my $q (@cat) { if ("$t $s" =~ /$q->[1]/i) { $k = $q->[0]; last } } my %m; @m{qw(Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec)} = 1 .. 12; my $dt = ''; $dt = sprintf '%04d-%02d-%02dT%s', $3, $m{$2} || 1, $1, $4 if ($d // '') =~ /(\d{1,2}) (\w{3}) (\d{4}) (\d\d:\d\d)/;
      push @n, { t => $t, l => $l, s => $f->[0], g => $f->[2], k => $k, d => $dt }; last if ++$c >= 8 } $st{ $f->[0] } = "$c Meldungen" }
  die 'keine Meldungen' unless @n; @n = (sort { $b->{d} cmp $a->{d} } @n); return { items => [ @n[0 .. ($#n < 44 ? $#n : 44)] ], feeds => \%st, period => $n[0]{d} } });
my $oiv = $J->decode(slurp("$D/oiv.json")); $out{oiv} = $oiv; $out{status}{oiv} = { name => 'OIV, UN Tourism (gepflegte Berichte)', url => $oiv->{url}, state => 'manual', ts => 0, last => '2026-11-24', ttl => 0, period => $oiv->{years}[-1], err => '' };
# Verlauf: ein Eintrag je Tag, daraus wächst die eigene Plansel-Datenbank
my $h = eval { $J->decode(slurp("$D/history.json") // '[]') } || []; my $day = substr $iso, 0, 10; my $b = $out{blocks}; my $e = { d => $day, usd => $b->{ecb}{rates}{USD}, t => $b->{ipma} ? $b->{ipma}{hours}[-1][1] : undef, expPT => $b->{comext} && @{ $b->{comext}{monthly} } ? $b->{comext}{monthly}[-1] : undef, news => $b->{news} ? scalar @{ $b->{news}{items} } : 0 };
if (@$h && $h->[-1]{d} eq $day) { $h->[-1] = $e } else { push @$h, $e }
# Auffällige Veränderungen
my @al; if (my $m = $b->{comext}{monthly}) { if (@$m > 13 && $m->[-13][1]) { my $c = 100 * ($m->[-1][1] / $m->[-13][1] - 1); push @al, sprintf('Export Portugal %s: %+.1f %% zum Vorjahresmonat', $m->[-1][0], $c) if abs $c > 20 } } push @al, "$_->{name}: seit ".int(($now-$_->{ts})/3600).' h ohne neue Daten' for grep { $_->{ts} && $_->{ttl} && $now - $_->{ts} > $_->{ttl} * 180 } values %{ $out{status} }; $out{alerts} = \@al; $out{log} = [ (@log, @{ $old->{log} || [] })[0 .. 39] ]; @{ $out{log} } = grep { defined } @{ $out{log} };
for (['data.json', \%out], ['history.json', $h]) { open my $o, '>:raw', "$D/$_->[0].tmp" or die $!; print $o $J->encode($_->[1]); close $o; rename "$D/$_->[0].tmp", "$D/$_->[0]" }
printf "%-10s %-6s %s %s\n", $_, $out{status}{$_}{state}, $out{status}{$_}{period} // '', $out{status}{$_}{err} // '' for sort keys %{ $out{status} };
