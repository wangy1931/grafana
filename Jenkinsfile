pipeline {
  agent {
    node {
      label '204'
    }
    
  }
  stages {
    stage('change directory and check') {
      steps {
        dir(path: '/root/Documents/cloudwiz/src/github.com/wangy1931/grafana') {
          sh '''go version
npm --version
git status'''
        }
        
      }
    }
    stage('pull') {
      steps {
        sh 'git pull origin master'
      }
    }
    stage('build') {
      steps {
        sh 'go run build.go build'
      }
    }
    stage('package') {
      steps {
        sh 'go run build.go package'
      }
    }
    stage('copy file & deploy') {
      steps {
        echo 'done'
      }
    }
  }
}