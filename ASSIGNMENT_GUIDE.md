# Guestbook Application Assignment Guide

This guide provides step-by-step instructions for completing the 10 tasks in the assignment, including where to take screenshots for submission.

## Task 1: Update the Dockerfile

The Dockerfile has already been created in this repository. You can find it at `guestbook-app/Dockerfile`.

**Screenshot**: Take a screenshot of the Dockerfile showing its contents.

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

**Screenshot**: Take a screenshot of the terminal showing the successful push of the image to IBM Cloud Container Registry.

## Task 3: Deploy Guestbook v1 Application

1. Update the deployment.yaml file with your namespace:
   ```
   # For Windows:
   (Get-Content k8s/deployment.yaml) -replace '\${NAMESPACE}', '<your-namespace>' | Set-Content k8s/deployment.yaml
   
   # For Linux/Mac:
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
   
4. Access the application at http://<worker-node-external-ip>:30080

**Screenshot**: Take a screenshot of the browser showing the index page of the deployed Guestbook v1 application.

## Task 4: Create Horizontal Pod Autoscaler

Apply the HPA configuration:
```
kubectl apply -f k8s/hpa.yaml
```

**Screenshot**: Take a screenshot of the terminal showing the successful creation of the Horizontal Pod Autoscaler.

## Task 5: Test Horizontal Pod Autoscaler

1. Generate load to trigger autoscaling:
   ```
   # Run in one terminal:
   kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://guestbook:3000; done"
   ```

2. In another terminal, watch the HPA scale the pods:
   ```
   kubectl get hpa guestbook-hpa --watch
   ```

**Screenshot**: Take a screenshot of the terminal showing the replicas in the Horizontal Pod Autoscaler being scaled correctly.

## Task 6: Update the Guestbook Application to v2

1. Update the VERSION environment variable in the Dockerfile:
   ```
   # For Windows:
   (Get-Content Dockerfile) -replace 'ENV VERSION=v1', 'ENV VERSION=v2' | Set-Content Dockerfile
   
   # For Linux/Mac:
   sed -i 's/ENV VERSION=v1/ENV VERSION=v2/g' Dockerfile
   ```

2. Build and push the updated image:
   ```
   docker build -t us.icr.io/<your-namespace>/guestbook:v2 .
   docker push us.icr.io/<your-namespace>/guestbook:v2
   ```

**Screenshot**: Take a screenshot of the terminal showing the Docker build and push commands for updating the guestbook.

## Task 7: Update Deployment for Autoscaling

Update the deployment to use the v2 image:
```
kubectl set image deployment/guestbook guestbook=us.icr.io/<your-namespace>/guestbook:v2
```

**Screenshot**: Take a screenshot of the terminal showing the deployment configuration for autoscaling.

## Task 8: Verify the Updated Application

Access the application at http://<worker-node-external-ip>:30080 and verify that it shows v2.

**Screenshot**: Take a screenshot of the browser showing the updated index page of the deployed Guestbook v2 application.

## Task 9: Check Revision History

```
kubectl rollout history deployment/guestbook
```

**Screenshot**: Take a screenshot of the terminal showing the revision history for the deployment after rollout of the deployment.

## Task 10: Rollback the Deployment

```
kubectl rollout undo deployment/guestbook
```

Verify that the application is back to v1 by accessing it in the browser.

**Screenshot**: Take a screenshot of the browser showing the updated deployment after rollback of the update (should show v1 again).