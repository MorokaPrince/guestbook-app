#!/bin/bash

# Script to rollback the Guestbook application from v2 to v1

echo "Rolling back deployment to previous version (v1)..."
kubectl rollout undo deployment/guestbook

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/guestbook

echo "Deployment rolled back to v1!"
echo "To verify, check the application UI or run: kubectl describe deployment guestbook"