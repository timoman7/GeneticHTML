echo gitInit.bat >> .gitignore
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/timoman7/GeneticHTML.git
git push -u origin master
