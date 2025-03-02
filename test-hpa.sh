#!/bin/bash

# Script to test the Horizontal Pod Autoscaler for the Guestbook application

echo "Creating a load generator pod to increase CPU usage..."
kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://guestbook:3000; done"

# Note: This script will run in the foreground and you'll need to press Ctrl+C to stop it
# In another terminal, you can monitor the HPA with:
# kubectl get hpa guestbook-hpa --watch