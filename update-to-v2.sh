#!/bin/bash

# Script to update the Guestbook application from v1 to v2

# Set your namespace
NAMESPACE="your-namespace"

echo "Updating Dockerfile to v2..."
sed -i 's/ENV VERSION=v1/ENV VERSION=v2/g' Dockerfile

echo "Building v2 Docker image..."
docker build -t us.icr.io/$NAMESPACE/guestbook:v2 .

echo "Pushing v2 Docker image to IBM Cloud Container Registry..."
docker push us.icr.io/$NAMESPACE/guestbook:v2

echo "Updating Kubernetes deployment to use v2 image..."
kubectl set image deployment/guestbook guestbook=us.icr.io/$NAMESPACE/guestbook:v2

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/guestbook

echo "Deployment updated to v2!"
echo "To check the revision history, run: kubectl rollout history deployment/guestbook"
echo "To rollback to v1, run: kubectl rollout undo deployment/guestbook"