$root = $PSScriptRoot
$l = New-Object System.Net.HttpListener; $l.Prefixes.Add('http://localhost:5173/'); $l.Start()
$T=@{'.html'='text/html; charset=utf-8';'.css'='text/css';'.js'='text/javascript';'.jpg'='image/jpeg';'.png'='image/png';'.svg'='image/svg+xml';'.txt'='text/plain; charset=utf-8';'.json'='application/json';'.xml'='application/xml'}
while ($l.IsListening) { $c=$l.GetContext(); $p=[Uri]::UnescapeDataString($c.Request.Url.AbsolutePath); if($p.EndsWith('/')){$p+='index.html'}
 $f=Join-Path $root $p.TrimStart('/'); try { $b=[IO.File]::ReadAllBytes($f); $ct=$T[[IO.Path]::GetExtension($f).ToLower()]; if(-not $ct){$ct='application/octet-stream'}; $c.Response.ContentType=$ct; $c.Response.OutputStream.Write($b,0,$b.Length) } catch { $c.Response.StatusCode=404 }; $c.Response.Close() }
