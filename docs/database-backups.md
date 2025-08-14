### Database Backups and Restore

**Schedule**: A GitHub Actions workflow runs daily at 03:00 UTC to back up the production PostgreSQL database.

**Where backups live**: As GitHub Actions artifacts, retained for 7 days by default. You can download from the workflow run page.

#### Configure
- **DATABASE_URL secret**: In your repository settings → Secrets and variables → Actions → New repository secret. Add `DATABASE_URL` for the production database.

#### Manual run
- Trigger via Actions → "Daily Postgres Backup" → Run workflow.

#### Local backup
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db ./scripts/backup-db.sh
```

#### Local restore
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db ./scripts/restore-db.sh backups/your_backup.sql.gz
```

Notes:
- The scripts parse `DATABASE_URL` of the form `postgresql://user:password@host:5432/database`.
- Restoring will apply the SQL to the target database; ensure it is the correct environment.

