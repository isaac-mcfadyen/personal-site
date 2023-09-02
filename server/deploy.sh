# Build the site.
cd .. && pnpm run build && cd server

# Build and deploy the Lambda.
cargo lambda build --arm64 --release --output-format zip
aws lambda update-function-code --function-name personal-site \
  --zip-file fileb://./target/lambda/server/bootstrap.zip \
  --region us-east-1 > /dev/null
echo "Deployed!"
echo