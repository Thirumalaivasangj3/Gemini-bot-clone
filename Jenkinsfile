pipeline {
    agent any

    environment {
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

                    // Run the new one mapping port 8081
                    sh 'docker run -d -p 8081:80 --name gemini-container ${IMAGE_NAME}:latest'

                    // Wait for a few seconds to ensure container is up
                    sh 'sleep 5'

                    // Open the application automatically
                    echo 'Opening the portal on port 8081...'
                    sh 'xdg-open http://localhost:8081 || open http://localhost:8081 || true'
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Build and Deployment Successful! Portal running on http://localhost:8081'
        }
        failure {
            echo '❌ Build or Deployment Failed!'
        }
    }
}
