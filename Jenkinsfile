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
          sh '''source ~/.bash_profile
source ~/.bashrc

go version
npm --version
git status


echo pwd

alias grunt='''
        }
        
        sh '''echo $GOPATH
'''
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
        dir(path: '/root/Documents/cloudwiz/src/github.com/wangy1931/grafana') {
          sh '''alias grunt="/usr/bin/grunt"
go run build.go package'''
        }
        
      }
    }
    stage('copy file & deploy') {
      steps {
        echo 'done'
      }
    }
  }
  environment {
    GOPATH = '/root/Documents/cloudwiz/src/github.com/wangy1931/grafana/Godeps/_workspace:/root/Documents/cloudwiz'
  }
}