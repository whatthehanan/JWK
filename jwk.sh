#!/bin/bash
set -e
if [ $# -ne 1 ]; then
  echo "Usage: $(basename $0) <name>"
  echo "- name: name of certificate and keys"
  exit 1
fi

name=$1
mkdir -p ${name}
pushd $(pwd)/${name}
openssl genrsa -out ${name}.pem 4096
openssl rsa -in ${name}.pem -out ${name}-public.pem -pubout
openssl req -key ${name}.pem -new -x509 -days 3650 -out ${name}-cert.pem
openssl pkcs12 -export -inkey ${name}.pem -in ${name}-cert.pem -out ${name}-keys.pfx -name ${name}
chmod 600 *.pem
ssh-keygen -e -m pkcs8 -f ${name}.pem | pem-jwk | jq '{kid: "halcyon", kty: .kty , use: "sig", n: .n , e: .e, kty: .kty }' | tee ${name}-jwk.json
popd