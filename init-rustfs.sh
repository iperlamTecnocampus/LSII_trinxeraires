```sh
#!/bin/sh
set -eu

ENDPOINT="http://rustfs:9000"
BUCKET="${RUSTFS_BUCKET:-protube}"

# Wait for RustFS to become available.
until mc alias set rustfs "$ENDPOINT" \
    "$RUSTFS_ADMIN_ACCESS_KEY" \
    "$RUSTFS_ADMIN_SECRET_KEY" >/dev/null 2>&1; do
    echo "Waiting for RustFS..."
    sleep 3
done

# Create the bucket if it doesn't already exist.
mc mb --ignore-existing "rustfs/$BUCKET"

# Create the application user if it doesn't already exist.
if ! mc admin user info rustfs "$RUSTFS_USER" >/dev/null 2>&1; then
    mc admin user add rustfs \
        "$RUSTFS_USER" \
        "$RUSTFS_PASSWORD"
fi

# Create a policy granting full access to this bucket only.
cat >/tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": [
        "arn:aws:s3:::$BUCKET"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts"
      ],
      "Resource": [
        "arn:aws:s3:::$BUCKET/*"
      ]
    }
  ]
}
EOF

mc admin policy create rustfs "${BUCKET}-full-access" /tmp/bucket-policy.json

# Attach the bucket-specific policy to the application user.
mc admin policy attach rustfs "${BUCKET}-full-access" --user "$RUSTFS_USER"

echo "RustFS initialization completed."
echo "Bucket: $BUCKET"
echo "User: $RUSTFS_USER"
```