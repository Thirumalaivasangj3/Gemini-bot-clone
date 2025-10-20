pipeline {
    agent any

    environment {
        // Replace these with your Docker Hub credentials if you plan to push
        DOCKER_HUB_USER = 'thiru2003'
        IMAGE_NAME = 'gemini-bot'
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Cloning the repository...'
                git branch: 'main', url: 'https://github.com/Thirumalaivasangj3/Gemini-bot-clone.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    sh 'docker build -t ${IMAGE_NAME}:latest .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                echo 'Running Docker container...'
                script {
                    // Stop old container if exists
                    sh 'docker rm -f gemini-container || true'
                    // Run the new one
                    sh 'docker run -d -p 8081:80 --name gemini-container ${IMAGE_NAME}:latest'
                }
            }
        }

        stage('Optional: Push to Docker Hub') {
            when {
                expression { return env.DOCKER_HUB_USER != 'your-dockerhub-username' }
            }
            steps {
                echo 'Pushing image to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh '''
                    echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                    docker tag ${IMAGE_NAME}:latest $USERNAME/${IMAGE_NAME}:latest
                    docker push $USERNAME/${IMAGE_NAME}:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Build and Deployment Successful!'
        }
        failure {
            echo '❌ Build or Deployment Failed!'
        }
    }
}
