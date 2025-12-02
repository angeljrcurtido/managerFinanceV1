#!/bin/bash
cd /home/angelcurtido/proyects/managerFinanceV1/android/app
echo "MiApp2024Secure!" | java -jar pepk.jar \
  --keystore=my-upload-key.keystore \
  --alias=my-key-alias \
  --output=private_key_encrypted.zip \
  --include-cert \
  --rsa-aes-encryption \
  --encryption-key-path=encryption_public_key.pem
