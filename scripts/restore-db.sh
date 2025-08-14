#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/restore-db.sh path/to/backup.sql.gz
#   DATABASE_URL=postgresql://user:pass@host:5432/dbname ./scripts/restore-db.sh backups/db_20240101T000000Z.sql.gz

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Error: DATABASE_URL is not set. Export it or prefix the command." >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 path/to/backup.sql.gz" >&2
  exit 1
fi

backup_file="$1"
if [[ ! -f "$backup_file" ]]; then
  echo "Error: backup file not found: $backup_file" >&2
  exit 1
fi

# Parse DATABASE_URL
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

echo "Restoring $backup_file into database $database on $host:$port"

gunzip -c "$backup_file" | psql \
  --host="$host" \
  --port="$port" \
  --username="$username" \
  --dbname="$database" 

echo "Restore completed."

