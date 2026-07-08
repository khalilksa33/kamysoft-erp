# 🚀 KamySoft ERP - Quick Command Reference

## 📱 Local Machine (Windows)

### Set Kubeconfig
```powershell
$env:KUBECONFIG = "$HOME\.kube\config-hostb"
```

### View Status
```bash
kubectl get pods -n kamysoft-erp
kubectl get svc -n kamysoft-erp
kubectl get nodes
```

### View Logs
```bash
kubectl logs -f -n kamysoft-erp -l app=kamysoft-erp
```

### Connect via SSH
```powershell
ssh -i "$HOME\.ssh\host_b_key" -o "ProxyCommand=cloudflared access ssh --hostname ssh-erp.26i.uk" iicc2@ssh-erp.26i.uk
```

---

## 🖥️ Host B (After SSH Connection)

### Quick Commands
```bash
# View pods
sudo /usr/local/bin/k3s kubectl get pods -n kamysoft-erp

# View logs (real-time)
sudo /usr/local/bin/k3s kubectl logs -f -n kamysoft-erp -l app=kamysoft-erp

# Watch pods
sudo /usr/local/bin/k3s kubectl get pods -n kamysoft-erp -w

# Describe pod (troubleshooting)
sudo /usr/local/bin/k3s kubectl describe pod <POD_NAME> -n kamysoft-erp

# Scale application
sudo /usr/local/bin/k3s kubectl scale deployment kamysoft-erp --replicas=3 -n kamysoft-erp

# Restart pods
sudo /usr/local/bin/k3s kubectl rollout restart deployment/kamysoft-erp -n kamysoft-erp

# Get all resources
sudo /usr/local/bin/k3s kubectl get all -n kamysoft-erp

# Shell into pod
sudo /usr/local/bin/k3s kubectl exec -it <POD_NAME> -n kamysoft-erp -- /bin/bash

# Check resource usage
sudo /usr/local/bin/k3s kubectl top pods -n kamysoft-erp
```

### After Setup (Using Aliases)
```bash
source ~/.bashrc

# Then use simplified commands:
kubectl get pods -n kamysoft-erp
kubectl logs -f -n kamysoft-erp -l app=kamysoft-erp
kubectl describe pod <POD_NAME> -n kamysoft-erp
```

---

## 📊 Status Information

### Cluster Info
- **Node:** erp-worker-02
- **Kubernetes:** v1.36.2+k3s1
- **Namespace:** kamysoft-erp

### Services
- **App:** kamysoft-erp (NodePort 8089:30089)
- **MongoDB:** mongodb (ClusterIP 27017)
- **Ingress:** kamysoft-erp-ingress (26i.uk, *.26i.uk)

### URLs
- **Web:** https://ssh-erp.26i.uk
- **Internal:** 192.168.8.59:8089
- **Database:** mongodb://mongodb.kamysoft-erp.svc.cluster.local:27017

---

## 🔍 Troubleshooting Commands

### Check Pod Status
```bash
kubectl get pods -n kamysoft-erp -o wide
kubectl describe pod <POD_NAME> -n kamysoft-erp
```

### View Events
```bash
kubectl get events -n kamysoft-erp
kubectl get events -n kamysoft-erp --sort-by='.lastTimestamp'
```

### Check Logs
```bash
# Last 100 lines
kubectl logs -n kamysoft-erp <POD_NAME> --tail=100

# Previous container logs (if crashed)
kubectl logs -n kamysoft-erp <POD_NAME> --previous

# All containers
kubectl logs -n kamysoft-erp <POD_NAME> --all-containers=true
```

### Resource Usage
```bash
kubectl top pods -n kamysoft-erp
kubectl describe node erp-worker-02
```

### Network Testing (from pod)
```bash
kubectl exec -it <POD_NAME> -n kamysoft-erp -- nc -zv mongodb 27017
kubectl exec -it <POD_NAME> -n kamysoft-erp -- curl http://localhost:8089
```

---

## 🔄 Deployment Management

### Restart Pods
```bash
# Rolling restart (one pod at a time)
kubectl rollout restart deployment/kamysoft-erp -n kamysoft-erp

# Wait for rollout
kubectl rollout status deployment/kamysoft-erp -n kamysoft-erp

# Check rollout history
kubectl rollout history deployment/kamysoft-erp -n kamysoft-erp
```

### Scale Deployment
```bash
# Scale to 3 replicas
kubectl scale deployment kamysoft-erp --replicas=3 -n kamysoft-erp

# Monitor scaling
kubectl get pods -n kamysoft-erp -w
```

### Update Deployment
```bash
# Edit deployment
kubectl edit deployment/kamysoft-erp -n kamysoft-erp

# Apply new manifest
kubectl apply -f k8s/app.yaml -n kamysoft-erp

# Check update progress
kubectl get pods -n kamysoft-erp -o wide
```

---

## 💾 Backup & Recovery

### Export Current Configuration
```bash
# Export all resources
kubectl get all -n kamysoft-erp -o yaml > kamysoft-backup.yaml

# Export specific deployment
kubectl get deployment kamysoft-erp -n kamysoft-erp -o yaml > deployment-backup.yaml

# Export secrets (⚠️ be careful with secrets!)
kubectl get secret -n kamysoft-erp -o yaml > secrets-backup.yaml
```

### Restore
```bash
kubectl apply -f kamysoft-backup.yaml -n kamysoft-erp
```

---

## 🔐 Security & Access

### View Secrets
```bash
# List secrets
kubectl get secrets -n kamysoft-erp

# View secret content (base64 encoded)
kubectl get secret kamysoft-erp-secrets -n kamysoft-erp -o yaml

# Decode secret
kubectl get secret kamysoft-erp-secrets -n kamysoft-erp -o jsonpath='{.data.SAAS_ADMIN_KEY}' | base64 -d
```

### View ConfigMaps
```bash
kubectl get configmaps -n kamysoft-erp
kubectl describe configmap kamysoft-erp-config -n kamysoft-erp
```

### Edit ConfigMap
```bash
kubectl edit configmap kamysoft-erp-config -n kamysoft-erp
```

---

## 📈 Monitoring

### Watch Real-time Status
```bash
# Watch pods
kubectl get pods -n kamysoft-erp -w

# Watch all resources
kubectl get all -n kamysoft-erp -w

# Stream logs
kubectl logs -f -n kamysoft-erp <POD_NAME>
```

### Performance Metrics
```bash
# Pod resources
kubectl top pods -n kamysoft-erp

# Node resources
kubectl top nodes

# Detailed node info
kubectl describe node erp-worker-02
```

---

## 🛠️ Maintenance

### Check k3s Service Status (on Host B)
```bash
sudo systemctl status k3s
sudo systemctl restart k3s
sudo systemctl stop k3s
sudo systemctl start k3s
```

### View k3s Logs (on Host B)
```bash
sudo journalctl -u k3s -f
sudo journalctl -u k3s --tail=100
```

### k3s Management (on Host B)
```bash
# Get cluster info
sudo k3s kubectl cluster-info

# Get nodes
sudo k3s kubectl get nodes -o wide

# Get resources
sudo k3s kubectl api-resources
```

---

## 🆘 Emergency Commands

### Force Delete Stuck Pod
```bash
kubectl delete pod <POD_NAME> -n kamysoft-erp --grace-period=0 --force
```

### Delete and Restart Deployment
```bash
kubectl delete deployment kamysoft-erp -n kamysoft-erp
kubectl apply -f k8s/app.yaml -n kamysoft-erp
```

### Clear Completed Pods
```bash
kubectl delete pods -n kamysoft-erp --field-selector=status.phase=Succeeded
```

---

## 📚 Useful Resources

- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [k3s Documentation](https://docs.k3s.io/)
- [Kubernetes Troubleshooting](https://kubernetes.io/docs/tasks/debug-application-cluster/)

---

**Happy Deploying! 🚀**
