#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/backup-db.sh
#   DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public ./scripts/backup-db.sh

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Error: DATABASE_URL is not set. Export it or prefix the command." >&2
  exit 1
fi

timestamp="$(date -u +"%Y%m%dT%H%M%SZ")"
backup_dir="backups"
mkdir -p "$backup_dir"

# Parse database URL into pg_dump-friendly parts
# Supports standard forms like: postgresql://user:pass@host:5432/dbname

url_no_scheme="${DATABASE_URL#postgresql://}"
creds_host_db="${url_no_scheme%%\?*}"

userpass="${creds_host_db%@*}"
hostportdb="${creds_host_db#*@}"

username="${userpass%%:*}"
password="${userpass#*:}"

hostport="${hostportdb%%/*}"
database="${hostportdb#*/}"

host="${hostport%%:*}"
port="${hostport#*:}"
if [[ "$port" == "$host" ]]; then
  port=5432
fi

export PGPASSWORD="$password"

outfile="$backup_dir/${database}_${timestamp}.sql.gz"
echo "Creating backup: $outfile"

pg_dump \
  --host="$host" \
  --port="$port" \
  --username="$username" \
  --dbname="$database" \
  --no-owner \
  --no-privileges \
  --format=plain \
  | gzip -9 > "$outfile"

echo "Backup completed: $outfile"

