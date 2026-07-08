# 🎉 KamySoft ERP - k3s Deployment Complete!

**Date:** July 6, 2026  
**Host:** Host B (ssh-erp.26i.uk)  
**Cluster:** k3s v1.36.2+k3s1  
**Status:** ✅ Running and Healthy

---

## 📊 Deployment Summary

### Cluster Status
- **Node:** erp-worker-02 (Ready, control-plane)
- **Kubernetes Version:** v1.36.2+k3s1
- **Age:** 122+ minutes

### Running Services

#### Pods
```
✅ kamysoft-erp-5768c7df6-g2w85    1/1 Running    (21+ mins)
✅ mongodb-d6c9d4bfb-clljz         1/1 Running    (22+ mins)
```

#### Services
```
✅ kamysoft-erp    NodePort    10.43.80.99     8089:30089/TCP
✅ mongodb         ClusterIP   10.43.66.70     27017/TCP
```

#### Ingress
```
✅ kamysoft-erp-ingress    26i.uk, *.26i.uk    192.168.8.59    80
```

---

## 🌐 Access Your Application

### Web Access (Recommended)
- **URL:** https://ssh-erp.26i.uk
- **Method:** Cloudflare Tunnel
- **Status:** ✅ Active

### Direct Kubernetes Access
- **Internal IP:** 192.168.8.59
- **Service Port:** 8089 (NodePort 30089)
- **Cluster IP:** 10.43.80.99

### Database Connection
- **MongoDB URI:** mongodb://mongodb.kamysoft-erp.svc.cluster.local:27017/kamysoft-erp
- **Internal IP:** 10.43.66.70
- **Port:** 27017

---

## 👤 User Access on Host B (iicc2)

### Quick Commands
```bash
# View all pods
sudo /usr/local/bin/k3s kubectl get pods -n kamysoft-erp

# View pod logs
sudo /usr/local/bin/k3s kubectl logs -n kamysoft-erp -l app=kamysoft-erp

# Watch pod status in real-time
sudo /usr/local/bin/k3s kubectl get pods -n kamysoft-erp -w

# Describe a pod (troubleshooting)
sudo /usr/local/bin/k3s kubectl describe pod <pod-name> -n kamysoft-erp

# Scale the application
sudo /usr/local/bin/k3s kubectl scale deployment kamysoft-erp --replicas=3 -n kamysoft-erp
```

### Aliases Available
After reloading bashrc, you can use:
```bash
source ~/.bashrc
kubectl get pods -n kamysoft-erp  # Simplified command
```

### Environment
```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

---

## 📱 Local Machine Access (kubectl)

### From Your Windows Machine
```powershell
# Set kubeconfig
$env:KUBECONFIG = "$HOME\.kube\config-hostb"

# Test connection
kubectl get nodes
kubectl get pods -n kamysoft-erp
```

### Kubeconfig Location
- **File:** `C:\Users\KAMY\.kube\config-hostb`
- **Server:** https://ssh-erp.26i.uk:6443
- **Namespace:** kamysoft-erp

---

## 📊 Application Status

### Startup Logs
```
✅ KamySoft POS & ERP server running on http://localhost:8089
✅ Successfully connected to MongoDB
✅ Database migration complete: Added tenantId to pre-existing documents
✅ Database seeded with default data:
   - Users: admin, manager, cashier, demo
   - Products, Invoices, Quotations, Expenses
   - Assets, Customers, Employees, Suppliers, Orders
```

### Database Verification
- MongoDB is initialized and running
- All collections are seeded with sample data
- Tenant migration completed

---

## 🔧 Management & Troubleshooting

### Monitor Application Logs
```bash
# Real-time logs
kubectl logs -f -n kamysoft-erp kamysoft-erp-5768c7df6-g2w85

# Last 50 lines
kubectl logs -n kamysoft-erp kamysoft-erp-5768c7df6-g2w85 --tail=50

# Previous logs (if pod restarted)
kubectl logs -n kamysoft-erp kamysoft-erp-5768c7df6-g2w85 --previous
```

### Check Resource Usage
```bash
kubectl top pods -n kamysoft-erp
kubectl top nodes
```

### Common Issues

#### Pods Not Running
```bash
# Check pod status
kubectl describe pod <pod-name> -n kamysoft-erp

# Check events
kubectl get events -n kamysoft-erp
```

#### Database Connection Issues
```bash
# Check MongoDB pod
kubectl logs -n kamysoft-erp mongodb-d6c9d4bfb-clljz

# Test connection from app pod
kubectl exec -it kamysoft-erp-5768c7df6-g2w85 -n kamysoft-erp -- nc -zv mongodb 27017
```

#### Restart Deployment
```bash
# Rolling restart
kubectl rollout restart deployment/kamysoft-erp -n kamysoft-erp

# Wait for restart
kubectl rollout status deployment/kamysoft-erp -n kamysoft-erp
```

---

## 🔐 Security Notes

### SSH Access Configuration
- **User:** iicc2
- **Host:** ssh-erp.26i.uk
- **Method:** Cloudflare Tunnel + SSH Key
- **Key Location:** `~/.ssh/host_b_key` (on your local machine)

### Sudo Access
- iicc2 has NOPASSWD sudo access for k3s commands
- Configure in: `/etc/sudoers.d/k3s`

### Kubernetes RBAC
- Current setup uses default service account
- For production, consider setting up proper RBAC policies

---

## 📈 Scaling & Optimization

### Horizontal Scaling
```bash
# Scale to 3 replicas
kubectl scale deployment kamysoft-erp --replicas=3 -n kamysoft-erp

# Monitor scaling
kubectl get pods -n kamysoft-erp -w
```

### Persistent Storage
- MongoDB uses a PersistentVolume (mongodb-pvc)
- Data is stored on Host B filesystem
- Location: Managed by k3s storage class

### Resource Limits
Check and update in `k8s/app.yaml` if needed:
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

---

## 📝 Environment Variables

### In Use (k3s Cluster)
```env
MONGO_URI=mongodb://mongodb.default.svc.cluster.local:27017/kamysoft-erp
JWT_SECRET=kamysoft_super_secret_key_2026
SAAS_ADMIN_KEY=kamysoft-saas-admin-2026
PORT=8089
```

### Update in ConfigMap
```bash
kubectl edit configmap kamysoft-erp-config -n kamysoft-erp
```

---

## 🔄 Continuous Integration & Deployment

### Re-deploy Application
```bash
# From Host B
cd /tmp/kamysoft-erp
git pull
kubectl apply -f k8s/app.yaml -n kamysoft-erp

# Or trigger rolling restart
kubectl rollout restart deployment/kamysoft-erp -n kamysoft-erp
```

### Update Application Image
```bash
# If using a new Docker image tag
kubectl set image deployment/kamysoft-erp kamysoft-erp=kamysoft-erp:v2.0 -n kamysoft-erp

# Verify rollout
kubectl rollout status deployment/kamysoft-erp -n kamysoft-erp
```

---

## 📞 Support Resources

### Documentation
- [k3s Documentation](https://docs.k3s.io/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)

### Key Files
- **App Manifest:** `k8s/app.yaml`
- **MongoDB Manifest:** `k8s/mongodb.yaml`
- **Ingress Config:** `k8s/ingress.yaml`
- **Deployment Guide:** `DEPLOYMENT-GUIDE-K3S.md`

### Useful Commands
```bash
# Full cluster status
kubectl get all -n kamysoft-erp

# Export manifests
kubectl get deployment kamysoft-erp -n kamysoft-erp -o yaml > backup.yaml

# Get cluster info
kubectl cluster-info
kubectl get nodes -o wide
```

---

## ✅ Verification Checklist

- [x] k3s installed and running
- [x] MongoDB deployed and connected
- [x] KamySoft ERP deployed and running
- [x] Ingress configured for domain routing
- [x] Database seeded with sample data
- [x] Application logs showing successful startup
- [x] kubectl access configured for local machine
- [x] SSH access configured for Host B
- [x] Sudo access configured for iicc2 user

---

## 🎯 Next Steps

1. **Test Application**
   - Visit https://ssh-erp.26i.uk in your browser
   - Login with default credentials

2. **Monitor Deployment**
   - Watch logs for any errors
   - Monitor resource usage

3. **Configure Production**
   - Update security settings
   - Set up proper RBAC
   - Configure backup strategy
   - Set up monitoring and alerting

4. **Scale as Needed**
   - Increase replicas for load handling
   - Set up load balancing

---

**Deployment Completed Successfully! 🚀**  
Your KamySoft ERP is now running on k3s and accessible via Cloudflare Tunnel.
