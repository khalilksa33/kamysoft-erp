#!/bin/bash

# KamySoft ERP - k3s Installation & Deployment Script for Host B
# This script installs k3s, deploys MongoDB, and deploys the KamySoft ERP application

set -e

echo "=========================================="
echo "KamySoft ERP - k3s Deployment on Host B"
echo "=========================================="

# Step 1: Install k3s
echo ""
echo "[1/5] Installing k3s..."
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml

# Wait for k3s to be ready
echo "Waiting for k3s to be ready..."
sleep 10

# Step 2: Verify k3s installation
echo ""
echo "[2/5] Verifying k3s installation..."
sudo k3s kubectl get nodes

# Step 3: Create namespace
echo ""
echo "[3/5] Creating Kubernetes namespace..."
sudo k3s kubectl create namespace kamysoft-erp --dry-run=client -o yaml | sudo k3s kubectl apply -f -

# Step 4: Deploy MongoDB
echo ""
echo "[4/5] Deploying MongoDB..."
sudo k3s kubectl apply -f k8s/mongodb.yaml -n kamysoft-erp

# Step 5: Deploy KamySoft ERP Application
echo ""
echo "[5/5] Deploying KamySoft ERP Application..."
sudo k3s kubectl apply -f k8s/app.yaml -n kamysoft-erp
sudo k3s kubectl apply -f k8s/ingress.yaml -n kamysoft-erp

# Verify deployment
echo ""
echo "=========================================="
echo "Deployment Status:"
echo "=========================================="
sudo k3s kubectl get deployments -n kamysoft-erp
sudo k3s kubectl get pods -n kamysoft-erp
sudo k3s kubectl get services -n kamysoft-erp
sudo k3s kubectl get ingress -n kamysoft-erp

echo ""
echo "✅ k3s deployment complete!"
echo ""
echo "Next steps:"
echo "1. Export kubeconfig: sudo cat /etc/rancher/k3s/k3s.yaml"
echo "2. Configure local kubectl to point to Host B"
echo "3. Monitor pods: kubectl get pods -n kamysoft-erp -w"
