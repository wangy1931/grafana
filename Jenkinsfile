pipeline {
  agent {
    dockerfile {
      filename '123'
    }
    
  }
  stages {
    stage('pull') {
      steps {
        echo 'pull from the grafana'
        sh 'git pull'
      }
    }
    stage('build') {
      parallel {
        stage('build') {
          steps {
            echo 'build'
            sh 'go run build.go'
          }
        }
        stage('') {
          steps {
            sh 'grunt --force'
          }
        }
      }
    }
    stage('') {
      steps {
        echo 'done'
        error 'ERROR'
      }
    }
    stage('deploy') {
      steps {
        fileExists 'README'
      }
    }
  }
}