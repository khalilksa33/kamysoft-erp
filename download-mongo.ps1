$url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.16.zip"
$zipPath = "mongodb.zip"
$extractPath = "mongodb-extract"
$finalPath = "mongodb-bin"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Write-Host "Downloading MongoDB Portable clean..."
$curlArgs = @("-L", "-o", $zipPath, $url, "--retry", "5")
& curl.exe $curlArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "Download failed."
    exit 1
}

Write-Host "Extracting using tar..."
if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
New-Item -ItemType Directory -Force -Path $extractPath | Out-Null
& tar -xf $zipPath -C $extractPath

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to extract ZIP via tar."
    exit 1
}

Write-Host "Moving binaries..."
if (Test-Path $finalPath) {
    Remove-Item $finalPath -Recurse -Force
}
Rename-Item -Path "$extractPath\mongodb-win32-x86_64-windows-6.0.16" -NewName $finalPath

Write-Host "Cleaning up..."
Remove-Item $zipPath -Force
Remove-Item $extractPath -Recurse -Force

Write-Host "Done!"
