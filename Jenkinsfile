pipeline {
      agent any

      tools {nodejs "NodeJS"}


      parameters{
          string(name: 'SPEC', defaultValue:"cypress/integration/1-getting-started/todo.spec.js", description: "Enter the cypress script path that you want to execute")
          choice(name: 'BROWSER', choices:['electron', 'chrome', 'edge', 'firefox'], description: "Select the browser to be used in your cypress tests")
      }

      options {
              ansiColor('xterm')
      }

      stages {
        stage('Build/Deploy app to staging') {
            steps {
              echo "Copying files to staging and restarting the app"
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'staging',
                            transfers: [
                                sshTransfer(
                                    cleanRemote: false,
                                    excludes: 'node_modules/,cypress/,**/*.yml',
                                    execCommand: '''
                                    cd /usr/share/nginx/html
                                    npm ci
                                    pm2 restart npm -- start''',
                                    execTimeout: 1200000,
                                    flatten: false,
                                    makeEmptyDirs: false,
                                    noDefaultExcludes: false,
                                    patternSeparator: '[, ]+',
                                    remoteDirectory: '',
                                    remoteDirectorySDF: false,
                                    removePrefix: '',
                                    sourceFiles: '**/*')],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: true)])
         }
        }
        stage('Run automated tests'){
            steps {
              echo "Running automated tests"
                sh 'npm prune'
                sh 'npm cache clean --force'
                sh 'npm i'
                sh 'npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator'
                //sh 'rm -f mochawesome.json'
                //sh 'npx cypress run --config baseUrl="http://34.140.29.128" --browser ${BROWSER} --spec ${SPEC} --reporter mochawesome'
                //sh 'npx cypress run --config baseUrl="http://35.228.18.150/" --browser ${BROWSER} --spec ${SPEC}'
                sh 'npm run e2e:staging1spec'
                //sh 'npx mochawesome-merge cypress/results/*.json -o mochawesome-report/mochawesome.json'
                //sh 'npx marge mochawesome-report/mochawesome.json'
            }
            post {
                success {
                    publishHTML (
                        target : [
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'mochawesome-report',
                            reportFiles: 'mochawesome.html',
                            reportName: 'My Reports',
                            reportTitles: 'The Report'])

                }
            }
        }

        stage('SonarQube analysis') {
          steps {
            def scannerHome = tool 'sonar-scanner';
            withSonarQubeEnv('SonarCloud') { // If you have configured more than one global server connection, you can specify its name
            sh "${scannerHome}/bin/sonar-scanner"
            }
          }
        }

        stage('Perform manual testing...'){
            steps {
                timeout(activity: true, time: 5) {
                    input 'Proceed to production?'
                }
           }
        }

        stage('Release to production') {
            steps {
            // similar procedure as in the 'Build/ Deploy to staging' stage, suppressed here for cost saving purposes
                echo "Deploying app in production environment"
           }
        }
    }
}