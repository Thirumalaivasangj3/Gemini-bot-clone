pipeline {
  agent any

  environment {
    IMAGE_NAME = "gemini-bot"
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          sh "docker build -t ${IMAGE_NAME}:${commit} ."
          sh "docker tag ${IMAGE_NAME}:${commit} ${IMAGE_NAME}:latest"
        }
      }
    }

    stage('Deploy Container') {
      steps {
        script {
          def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          sh """
            docker stop gemini-bot || true
            docker rm gemini-bot || true
            docker run -d --name gemini-bot -p 80:80 ${IMAGE_NAME}:${commit}
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deployed successfully! Visit http://<EC2-IP>/"
    }
    failure {
      echo "❌ Build or deploy failed."
    }
  }
}
