#!/bin/bash
# ATLAS VEX Database Backup Script

BACKUP_DIR="/var/backups/atlas-vex"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="atlas_vex_backup_$DATE"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Starting database backup: $BACKUP_NAME"

# Create MongoDB backup
mongodump --db atlasvex --out $BACKUP_DIR/$BACKUP_NAME

# Compress the backup
cd $BACKUP_DIR
tar -czf ${BACKUP_NAME}.tar.gz $BACKUP_NAME

# Remove uncompressed backup
rm -rf $BACKUP_NAME

# Keep only last 7 days of backups
find $BACKUP_DIR -name "atlas_vex_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"

# Optional: Upload to cloud storage (uncomment and configure)
# aws s3 cp $BACKUP_DIR/${BACKUP_NAME}.tar.gz s3://your-backup-bucket/
# or
# rclone copy $BACKUP_DIR/${BACKUP_NAME}.tar.gz remote:backups/

echo "Backup process finished"