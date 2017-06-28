#!/bin/bash
# Scripts to create mysql backup every half and hour
 
# Confiration value
mysql_host     = 'localhost'
mysql_database = 'auditor'
mysql_username = 'auditor'
mysql_password = 'pw.auditor'
backup_path    = /backup/mysql
expired        = 10			#how many days before the backup directory will be removed
 
today          = 'date +%Y-%m-%d'
 
if [ ! -d $backup_path/$today ]
then
        mkdir -p $backup_path/$today
else
        /usr/bin/mysqldump -h $mysql_host -u $mysql_username -p$mysql_password $mysql_database > $backup_path/$today/$mysql_database-'date +%H%M'.sql
fi
 
# Remove folder which more than 3 days
find $backup_path -type d -mtime +$expired | xargs rm -Rf

