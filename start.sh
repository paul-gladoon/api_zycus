export API_RUN_ENV=https://api.github.com
export API_TOKEN=b4e4801ac59bc670d4eabf4ec16b7149c52e3a19
export RUN_SUITS=smoke

rm -rf ./allure-results

#npm i

npm run test:api