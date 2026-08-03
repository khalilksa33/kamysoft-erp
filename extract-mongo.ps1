$zipPath = "mongodb.zip"
$extractPath = "mongodb-extract"
$finalPath = "mongodb-bin"

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
