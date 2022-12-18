#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

# prepare variables
origin_url=$(git remote get-url origin)
GITHUB_USERNAME="rafizz"
GITHUB_REPO_BRANCH_NAME="lets_meet"

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
echo 'dev.lets-meet.ml' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main
git push -f "git@github.com:$GITHUB_USERNAME/$GITHUB_USERNAME.github.io.git" "main:$GITHUB_REPO_BRANCH_NAME"

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages
# git push "$origin_url" main:gh-pages

cd -
