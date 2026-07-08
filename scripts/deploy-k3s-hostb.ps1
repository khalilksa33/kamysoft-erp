# KamySoft ERP - k3s Deployment Helper Script for Windows
# This script helps deploy KamySoft ERP to k3s on Host B via Cloudflare Tunnel

param(
    [Parameter(Mandatory=$false)]
    [string]$HostB = "ssh-erp.26i.uk",
    
    [Parameter(Mandatory=$false)]
    [string]$SSHUser = "iicc2"
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "=========================================="
Write-Host "KamySoft ERP - k3s Deployment Helper"
Write-Host "=========================================="
Write-Host ""

# Check if cloudflared is installed
Write-Host "[1] Checking cloudflared installation..."
try {
    $version = cloudflared --version
    Write-Host "✅ cloudflared installed: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ cloudflared not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/"
    exit 1
}

# Check if SSH key exists
Write-Host ""
Write-Host "[2] Checking SSH key..."
$keyPath = "$HOME\.ssh\host_b_key"
if (Test-Path $keyPath) {
    Write-Host "✅ SSH key found at: $keyPath" -ForegroundColor Green
} else {
    Write-Host "❌ SSH key not found at: $keyPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "To create the SSH key, run:"
    Write-Host "  # Extract the Host_B_SSH_PRIVATE_KEY from .env file and save it to:"
    Write-Host "  $keyPath"
    exit 1
}

# Option 1: Display manual deployment steps
Write-Host ""
Write-Host "=========================================="
Write-Host "Option A: Manual Deployment (Recommended)"
Write-Host "=========================================="
Write-Host ""
Write-Host "Since Cloudflare Tunnel is blocking SSH, you need to:"
Write-Host ""
Write-Host "1. SSH into Host B (manually, using your preferred method)"
Write-Host "2. Run the deployment script:"
Write-Host ""
Write-Host "   cd /tmp"
Write-Host "   curl -fsSL https://raw.githubusercontent.com/khalilksa33/kamysoft-erp/main/scripts/deploy-k3s-hostb.sh | bash"
Write-Host ""
Write-Host "Or download and run locally:"
Write-Host "   sudo bash /path/to/deploy-k3s-hostb.sh"
Write-Host ""

# Option 2: Display kubeconfig retrieval steps
Write-Host ""
Write-Host "=========================================="
Write-Host "Option B: Access k3s from Local Machine"
Write-Host "=========================================="
Write-Host ""
Write-Host "After k3s is installed on Host B, retrieve the kubeconfig:"
Write-Host ""
Write-Host "1. SSH into Host B and get the kubeconfig:"
Write-Host "   sudo cat /etc/rancher/k3s/k3s.yaml"
Write-Host ""
Write-Host "2. Copy the output and save locally as ~/.kube/config-hostb"
Write-Host ""
Write-Host "3. Update the 'server' line in the kubeconfig:"
Write-Host "   Replace: https://127.0.0.1:6443"
Write-Host "   With:    https://ssh-erp.26i.uk:6443"
Write-Host ""
Write-Host "4. Set KUBECONFIG and test connection:"
Write-Host "   `$env:KUBECONFIG = `"$HOME\.kube\config-hostb`""
Write-Host "   kubectl get nodes"
Write-Host ""

# Option 3: Display environment variable setup
Write-Host ""
Write-Host "=========================================="
Write-Host "Option C: Environment Variables Setup"
Write-Host "=========================================="
Write-Host ""
Write-Host "Update these in your .env file for k3s deployment:"
Write-Host ""
Write-Host "# MongoDB for k3s (internal DNS)"
Write-Host "MONGO_URI=mongodb://mongodb.default.svc.cluster.local:27017/kamysoft-erp"
Write-Host ""
Write-Host "# Or if MongoDB is in a specific namespace:"
Write-Host "MONGO_URI=mongodb://mongodb.kamysoft-erp.svc.cluster.local:27017/kamysoft-erp"
Write-Host ""

Write-Host ""
Write-Host "=========================================="
Write-Host "Troubleshooting"
Write-Host "=========================================="
Write-Host ""
Write-Host "If you can't SSH directly to Host B via Cloudflare Tunnel:"
Write-Host ""
Write-Host "1. Check if SSH is exposed in Cloudflare Tunnel config"
Write-Host "2. Try accessing via web terminal if Host B has one"
Write-Host "3. Use VPN or direct IP if available"
Write-Host "4. Configure Cloudflare Tunnel to expose SSH on a different port"
Write-Host ""

Write-Host "For more info: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/use-cases/ssh/"
Write-Host ""
