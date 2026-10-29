# Regenerates clean/Midhun-Mohanan-Resume.pdf from clean/index.html using headless Edge.
# Run after any change to the resume page:  powershell -File tools/build-resume-pdf.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$page = Join-Path $root 'clean\index.html'
$pdf  = Join-Path $root 'clean\Midhun-Mohanan-Resume.pdf'
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

$url = ([System.Uri]$page).AbsoluteUri
$edgeData = Join-Path $env:TEMP 'resume-pdf-edge'
& $edge --headless --disable-gpu --no-pdf-header-footer --user-data-dir="$edgeData" --print-to-pdf="$pdf" $url | Out-Null

if (-not (Test-Path $pdf)) { throw "PDF was not created" }
$pages = ([regex]::Matches([IO.File]::ReadAllText($pdf, [Text.Encoding]::GetEncoding(28591)), '/Type\s*/Page[^s]')).Count
"Wrote $pdf ($pages page(s), $((Get-Item $pdf).Length) bytes)"
