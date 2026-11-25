#!/usr/bin/env perl
# PLANSEL Global Wine Index: Aktiendaten und Indexberechnung. Nur Perl-Kernmodule und curl.
# Aufruf: perl stocks.pl <Ordner data>   Läuft höchstens alle 20 Stunden (FORCE=1 erzwingt). Fällt eine Aktie aus, bleibt ihr letzter Stand.
# Datenquelle austauschbar: nur die Subs hist() und mcap() anpassen.
use strict; use warnings; use utf8; use JSON::PP; use POSIX qw(strftime); use Time::Local qw(timegm);
binmode STDOUT, ":utf8"; my $D = shift // 'monitor/data'; my $J = JSON::PP->new->utf8->canonical; my $now = time; my $iso = strftime('%Y-%m-%dT%H:%M:%SZ', gmtime $now);
sub slurp { my $f = shift; open my $i, '<:raw', $f or return; local $/; <$i> }
my $cfg = $J->decode(slurp("$D/aktien.json")); my $old = eval { $J->decode(slurp("$D/stocks.json") // '{}') } || {};
if ($old->{ts} && $now - $old->{ts} < 20 * 3600 && !$ENV{FORCE}) { print "stocks.json ist aktuell\n"; exit }
my @log; my ($by, $bm) = split /-/, $cfg->{base}; my $P1 = timegm(0, 0, 0, 1, $bm - 1, $by);
sub get { my ($u) = @_; for my $try (1 .. 3) { open my $p, '-|', 'curl', '-sL', '--compressed', '-m', '40', '-A', 'Mozilla/5.0 (compatible; PlanselWineIndex/1.0)', '-w', "\n%{http_code}", $u or die 'curl'; binmode $p; local $/; my $b = <$p>; close $p; my ($c) = $b =~ /\n(\d+)\z/; $b =~ s/\n\d+\z//; return $b if ($c // 0) == 200; die "HTTP " . ($c // 0) . "\n" if $try == 3 || ($c // 0) == 404; sleep 5 * $try } }
sub enc { my $s = shift; $s =~ s/([^A-Za-z0-9.\-])/sprintf '%%%02X', ord $1/ge; $s }
# Monatskurse: { 'JJJJ-MM' => [Schluss, Schluss mit Dividenden] }
sub hist { my ($t) = @_; select undef, undef, undef, 0.3; my $r = $J->decode(get('https://query1.finance.yahoo.com/v8/finance/chart/' . enc($t) . "?period1=$P1&period2=$now&interval=1mo"))->{chart}{result}[0] or die "leer\n"; my $m = $r->{meta}; my %h; my $c = $r->{indicators}{quote}[0]{close} || []; my $a = ($r->{indicators}{adjclose} || [{}])->[0]{adjclose} || $c;
  for my $i (0 .. $#{ $r->{timestamp} }) { next unless defined $c->[$i] && $c->[$i] > 0; $h{ strftime('%Y-%m', gmtime($r->{timestamp}[$i] + ($m->{gmtoffset} || 0) + 7200)) } = [ $c->[$i], $a->[$i] // $c->[$i] ] } die "zu wenig Kurse\n" unless keys %h > 6;
  return { h => \%h, cur => $m->{currency}, px => $m->{regularMarketPrice} + 0, day => strftime('%Y-%m-%d', gmtime $m->{regularMarketTime}) } }
sub mcap { my ($t) = @_; my $r = $J->decode(get('https://query1.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/' . enc($t) . '?type=trailingMarketCap&period1=' . ($now - 86400 * 400) . '&period2=' . $now)); for my $x (@{ $r->{timeseries}{result} || [] }) { my $l = $x->{trailingMarketCap} or next; my ($v) = reverse grep { $_ } @$l; return ($v->{reportedValue}{raw} + 0, $v->{currencyCode}, $v->{asOfDate}) if $v } die "kein Börsenwert\n" }
my %unit = (GBp => ['GBP', 100], ILA => ['ILS', 100]); my (%S, %fx);
sub fx { my ($c) = @_; return undef if $c eq 'EUR'; $fx{$c} //= hist("EUR$c=X")->{h} }
my ($cm) = strftime('%Y-%m', gmtime $now); my @mon; { my ($y, $m) = split /-/, $cfg->{base}; while (1) { my $k = sprintf '%04d-%02d', $y, $m; last if $k gt $cm; push @mon, $k; $m++; if ($m > 12) { $m = 1; $y++ } } }
sub fill { my ($h) = @_; my $l; my %f; for my $k (@mon) { $l = $h->{$k} if defined $h->{$k}; $f{$k} = $l } \%f }
sub eur { my ($v, $c, $k) = @_; my $d = 1; ($c, $d) = @{ $unit{$c} } if $unit{$c}; $v /= $d; return $v if $c eq 'EUR'; my $f = fill(fx($c)); my $r = $f->{$k} or return undef; return $v / $r->[0] }
my %prev; for my $g (@{ $old->{groups} || [] }) { $prev{ $_->{t} } = $_ for @{ $g->{m} } }
my @out; my %P; my (%cg, %cc);
for my $g (@{ $cfg->{groups} }) { my @m;
  for my $s (@{ $g->{m} }) { my ($n, $t, $c) = @$s; my %e = (n => $n, t => $t, c => $c); my $x = eval { hist($t) };
    if ($x) { my $f = fill($x->{h}); my %e1; for my $k (@mon) { my $q = $f->{$k} or next; my $u = $x->{cur}; my $a = eur($q->[0], $u, $k); my $b = eur($q->[1], $u, $k); $e1{$k} = [$a, $b] if $a } $P{$t} = \%e1; $cg{$t} = $g->{g}; $cc{$t} = $c; $e{px} = $x->{px}; $e{cur} = $x->{cur}; $e{day} = $x->{day};
      my $last = $e1{ $mon[-1] }; my $y1 = $e1{ $mon[-13] }; $e{y1} = sprintf('%.1f', ($last->[0] / $y1->[0] - 1) * 100) + 0 if $last && $y1; } else { my $er = $@; chomp $er; push @log, "$t: $er" }
    my ($v, $cu, $d) = eval { mcap($t) }; if ($v) { $e{cap} = int(eur($v, $cu, $cm) / 1e6 * 10 + .5) / 10; $e{capDay} = $d } elsif ($prev{$t}) { $e{$_} = $prev{$t}{$_} for grep { defined $prev{$t}{$_} } qw(cap capDay) }
    if (!$x && $prev{$t}) { $e{$_} //= $prev{$t}{$_} for qw(px cur day y1) } push @m, \%e }
  push @out, { g => $g->{g}, idx => $g->{idx}, m => [ sort { ($b->{cap} // 0) <=> ($a->{cap} // 0) } @m ] } }
# Gleichgewichtet, alle drei Monate neu gewichtet; eine Aktie kommt dazu, sobald es Kurse gibt. Sp. 0 ohne, 1 mit Dividenden.
sub index { my ($mem, $sp) = @_; my ($lvl, @r, @in, %b) = (1000); my $start = 1000; my $on;
  for my $i (0 .. $#mon) { my $k = $mon[$i]; if (@in) { my $s = 0; $s += $P{$_}{$k}[$sp] / $b{$_} for @in; $lvl = $start * $s / @in }
    if ($i % 3 == 0 || !@in) { my @n = grep { $P{$_}{$k} } @$mem; if (@n) { @in = @n; %b = map { $_ => $P{$_}{$k}[$sp] } @in; $start = $lvl; $on = 1 } } push @r, $on ? sprintf('%.1f', $lvl) + 0 : undef } return \@r }
my @mem = grep { my $t = $_; grep { $_->{idx} && $_->{g} eq $cg{$t} } @{ $cfg->{groups} } } sort keys %P; my $want = 0; $want += $_->{idx} ? scalar @{ $_->{m} } : 0 for @{ $cfg->{groups} };
die "zu viele Aktien ohne Kurse: " . join(', ', @log) . "\n" if @mem < $want * .9;
my %eu = map { $_ => 1 } qw(FR DE IT ES PT PL RO FI GB CH SE IE TR); my %as = map { $_ => 1 } qw(CN HK IN TH);
my %sub; for my $g (@{ $cfg->{groups} }) { next unless $g->{idx}; $sub{ $g->{g} } = &index([ grep { $cg{$_} eq $g->{g} } @mem ], 0) } $sub{europe} = &index([ grep { $eu{ $cc{$_} } } @mem ], 0); $sub{asia} = &index([ grep { $as{ $cc{$_} } } @mem ], 0);
my $w = eval { hist('IWDA.AS')->{h} }; my @w; if ($w) { my $f = fill($w); my $b = $f->{ $mon[0] }; @w = map { $f->{$_} && $b ? sprintf('%.1f', $f->{$_}[0] / $b->[0] * 1000) + 0 : undef } @mon } else { @w = @{ ($old->{index} || {})->{world} || [] } }
for my $t (@mem) { for my $i (1 .. $#mon) { my ($a, $b) = ($P{$t}{ $mon[ $i - 1 ] }, $P{$t}{ $mon[$i] }); next unless $a && $b; my $r = $b->[0] / $a->[0]; push @log, "$t $mon[$i]: Monatssprung " . sprintf('%.0f %%', ($r - 1) * 100) if $r > 1.8 || $r < .45 } }
my %o = (ts => $now, generated => $iso, src => 'Yahoo Finance', url => 'https://finance.yahoo.com/', groups => \@out, log => \@log, members => scalar @mem,
  index => { months => \@mon, price => &index(\@mem, 0), total => &index(\@mem, 1), world => \@w, sub => \%sub });
open my $f, '>:raw', "$D/stocks.json.neu" or die; print $f $J->encode(\%o); close $f; rename "$D/stocks.json.neu", "$D/stocks.json" or die; print scalar(@mem), " Indexwerte, letzter Stand ", $o{index}{price}[-1], "\n", join("\n", @log), "\n";
