# Guestbook Application

A simple guestbook application built with Node.js and Express, containerized with Docker, and deployed to IBM Cloud Kubernetes Service.

## Prerequisites

- IBM Cloud account
- IBM Cloud CLI installed
- Docker installed
- kubectl installed
- Access to IBM Cloud Kubernetes Service

## Task 1: Update the Dockerfile

The Dockerfile is already created in this repository. It uses Node.js 16 Alpine as the base image and sets up the application.

## Task 2: Push the Guestbook Image to IBM Cloud Container Registry

1. Log in to IBM Cloud:
   ```
   ibmcloud login
   ```

2. Target the appropriate resource group:
   ```
   ibmcloud target -g <resource-group>
   ```

3. Log in to the IBM Cloud Container Registry:
   ```
   ibmcloud cr login
   ```

4. Create a namespace if you don't have one:
   ```
   ibmcloud cr namespace-add <your-namespace>
   ```

5. Build and tag the Docker image:
   ```
   docker build -t us.icr.io/<your-namespace>/guestbook:v1 .
   ```

6. Push the image to IBM Cloud Container Registry:
   ```
   docker push us.icr.io/<your-namespace>/guestbook:v1
   ```

## Task 3: Deploy Guestbook v1 Application

1. Update the deployment.yaml file with your namespace:
   ```
   sed -i 's/${NAMESPACE}/<your-namespace>/g' k8s/deployment.yaml
   ```

2. Apply the Kubernetes configuration files:
   ```
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

3. Get the URL to access the application:
   ```
   kubectl get nodes -o wide
   ```
   
   Access the application at http://<worker-node-external-ip>:30080

## Task 4: Create Horizontal Pod Autoscaler

Apply the HPA configuration:
```
kubectl apply -f k8s/hpa.yaml
```

## Task 5: Test Horizontal Pod Autoscaler

1. Generate load to trigger autoscaling:
   ```
   kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://guestbook:3000; done"
   ```

2. In another terminal, watch the HPA scale the pods:
   ```
   kubectl get hpa guestbook-hpa --watch
   ```

## Task 6: Update the Guestbook Application to v2

1. Update the VERSION environment variable in the Dockerfile:
   ```
   ENV VERSION=v2
   ```

2. Build and push the updated image:
   ```
   docker build -t us.icr.io/<your-namespace>/guestbook:v2 .
   docker push us.icr.io/<your-namespace>/guestbook:v2
   ```

## Task 7: Update Deployment for Autoscaling

1. Update the deployment to use the v2 image:
   ```
   kubectl set image deployment/guestbook guestbook=us.icr.io/<your-namespace>/guestbook:v2
   ```

## Task 8: Verify the Updated Application

Access the application at http://<worker-node-external-ip>:30080 and verify that it shows v2.

## Task 9: Check Revision History

```
kubectl rollout history deployment/guestbook
```

## Task 10: Rollback the Deployment

```
kubectl rollout undo deployment/guestbook
```

Verify that the application is back to v1.