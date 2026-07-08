# KamySoft ERP - k3s Deployment Guide for Host B

## Overview

This guide helps you deploy KamySoft ERP on a k3s cluster running on Host B via Cloudflare Tunnel.

## Current Situation

- **Host B**: Online and accessible at https://ssh-erp.26i.uk
- **Cloudflare Tunnel**: Configured for HTTPS web access only
- **SSH Issue**: Port 22 SSH connections are being blocked by Cloudflare Tunnel

## Deployment Approach

Since direct SSH isn't available through Cloudflare Tunnel, you have several options:

### ✅ Option 1: Manual SSH Access (Recommended)

If you have another way to access Host B (VPN, direct IP, bastion host, web terminal):

1. **SSH into Host B** using your preferred method
2. **Download the deployment script**:
   ```bash
   cd /tmp
   curl -fsSL https://raw.githubusercontent.com/khalilksa33/kamysoft-erp/main/scripts/deploy-k3s-hostb.sh | bash
   ```

3. **Or clone and deploy manually**:
   ```bash
   git clone https://github.com/khalilksa33/kamysoft-erp.git
   cd kamysoft-erp
   bash scripts/deploy-k3s-hostb.sh
   ```

### ✅ Option 2: Configure Cloudflare Tunnel for SSH

To expose SSH through Cloudflare Tunnel:

1. **Update Cloudflare Tunnel configuration** to route SSH traffic:
   ```yaml
   ingress:
     - hostname: ssh-erp.26i.uk
       service: ssh://localhost:22
     - service: http://localhost:8089  # Your web app
   ```

2. **Restart cloudflared** on Host B:
   ```bash
   sudo systemctl restart cloudflared
   ```

3. **Connect via SSH** using cloudflared proxy:
   ```bash
   ssh -o ProxyCommand="cloudflared access ssh --hostname ssh-erp.26i.uk" iicc2@ssh-erp.26i.uk
   ```

4. **Run the deployment script** once connected

### ✅ Option 3: Manual Step-by-Step Deployment

Run these commands directly on Host B (via whatever access method you have):

```bash
# 1. Install k3s
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml

# 2. Wait for k3s to be ready
sleep 10
sudo k3s kubectl get nodes

# 3. Create namespace
sudo k3s kubectl create namespace kamysoft-erp

# 4. Deploy MongoDB
sudo k3s kubectl apply -f k8s/mongodb.yaml -n kamysoft-erp

# 5. Deploy KamySoft ERP
sudo k3s kubectl apply -f k8s/app.yaml -n kamysoft-erp
sudo k3s kubectl apply -f k8s/ingress.yaml -n kamysoft-erp

# 6. Verify deployment
sudo k3s kubectl get pods -n kamysoft-erp
sudo k3s kubectl get svc -n kamysoft-erp
```

## Post-Deployment Setup

### Get kubeconfig from Host B

After k3s is installed, retrieve the kubeconfig:

```bash
# On Host B:
sudo cat /etc/rancher/k3s/k3s.yaml
```

Save the output to `~/.kube/config-hostb` on your local machine.

### Update kubeconfig for Remote Access

Edit the kubeconfig file and update the server address:

**Before:**
```yaml
server: https://127.0.0.1:6443
```

**After:**
```yaml
server: https://ssh-erp.26i.uk:6443
```

### Test Local Connection

```powershell
$env:KUBECONFIG = "$HOME\.kube\config-hostb"
kubectl get nodes
kubectl get pods -n kamysoft-erp
```

## Environment Variables for k3s

Update your `.env` file for k3s deployment:

```env
# MongoDB inside the cluster (internal Kubernetes DNS)
MONGO_URI=mongodb://mongodb.default.svc.cluster.local:27017/kamysoft-erp

# Or if MongoDB is in a specific namespace:
MONGO_URI=mongodb://mongodb.kamysoft-erp.svc.cluster.local:27017/kamysoft-erp

# Other settings (from existing .env)
JWT_SECRET=kamysoft_super_secret_key_2026
SAAS_ADMIN_KEY=kamysoft-saas-admin-2026
PORT=8089
```

## Kubernetes Manifests

The deployment uses these manifests from the `k8s/` folder:

- **app.yaml** - KamySoft ERP application deployment
- **mongodb.yaml** - MongoDB database deployment
- **ingress.yaml** - Ingress controller for domain routing

Ensure these are properly configured for your Host B environment.

## Monitoring Deployment

### Check Deployment Status

```bash
# Get all resources in the namespace
kubectl get all -n kamysoft-erp

# Watch pod status in real-time
kubectl get pods -n kamysoft-erp -w

# Check pod logs
kubectl logs -n kamysoft-erp <pod-name>

# Describe a pod for events/errors
kubectl describe pod -n kamysoft-erp <pod-name>
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Pods not starting | Check logs: `kubectl logs -n kamysoft-erp <pod-name>` |
| MongoDB connection failed | Verify MongoDB pod is running: `kubectl get pods -n kamysoft-erp` |
| Ingress not working | Check ingress config: `kubectl describe ingress -n kamysoft-erp` |
| ImagePullBackOff | Ensure Docker image is built and accessible |

## Next Steps

1. ✅ Install k3s using your preferred method (Option 1, 2, or 3)
2. ✅ Verify all pods are running
3. ✅ Retrieve and configure kubeconfig for local access
4. ✅ Test application at https://ssh-erp.26i.uk
5. ✅ Monitor logs and performance

## Troubleshooting

### SSH Connection Timeout

If you see `Connection to UNKNOWN port 65535: Unknown error`:
- SSH is not exposed through Cloudflare Tunnel
- Follow Option 2 (configure Cloudflare) or use alternative access method

### k3s kubectl Command Not Found

Add k3s to PATH:
```bash
export PATH=$PATH:/usr/local/bin
# Or use:
sudo k3s kubectl ...
```

### Persistent Storage Issues

By default, k3s uses local storage. For production:
```bash
# Check storage classes
kubectl get sc

# Use proper StorageClass in MongoDB manifest
```

## Resources

- [k3s Documentation](https://docs.k3s.io/)
- [Cloudflare Tunnel SSH Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/use-cases/ssh/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [KamySoft ERP GitHub](https://github.com/khalilksa33/kamysoft-erp)
