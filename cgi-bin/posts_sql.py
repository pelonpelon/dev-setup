#! /usr/bin/env python2.4
# -*- coding: utf-8 -*-

import MySQLdb as mdb
import sys, os

# host = "50.63.244.197"
if os.environ['HOME'] == '/Users/pelon':
  host = "localhost"
else:
  host = "sfeaglewp.db.9803620.hostedresource.com"

user = "sfeaglewp"
password = "S@nFrancisc0"
db = "sfeaglewp"

sql = '''
SELECT innerp.`ID`
  FROM `wp_posts` AS innerp, `wp_postmeta` AS m
    JOIN `wp_postmeta` AS innerm
      ON innerp.`ID` = innerm.`post_id`
        WHERE
          innerp.`post_type` = 'attachment'
          AND innerp.`post_status` = 'publish'
          AND m._thumbnail_id = innerp.`ID`
          AND innerm.`meta_key` = 'date_num'
          AND innerm.`meta_value` >= UNIX_TIMESTAMP(CURDATE() - INTERVAL 12 HOUR)
          GROUP BY m.`post_id`
          ORDER BY m.`post_id` DESC
'''

current = '''
  SELECT *
  FROM `wp_postmeta` as m
  RIGHT JOIN
  (
    SELECT innerp.`ID`
    FROM `wp_posts` AS innerp
    JOIN `wp_postmeta` AS innerm
    ON innerp.`ID` = innerm.`post_id`
    WHERE innerp.`post_type` = 'event'
    AND innerm.`meta_value` <> ''
    AND innerm.`meta_value` NOT LIKE '%field%'
    AND innerm.`meta_key` NOT LIKE '%field%'
    AND innerm.`meta_key` NOT REGEXP '^_edit'
    AND innerm.`meta_key` NOT REGEXP '^type_of_event'
    AND innerm.`meta_key` NOT REGEXP '^_wp_attach'
    AND innerp.`post_status` = 'publish'
    AND innerm.`meta_key` = 'date_num'
    AND innerm.`meta_value` >= UNIX_TIMESTAMP(CURDATE() - INTERVAL 12 HOUR)
  ) AS current
  ON m.`post_id` = current.`ID`
  ORDER BY m.`post_id` DESC
'''

try:

  try:
    con = mdb.connect(host, user, password, db)

    # cur = con.cursor()
    cur = con.cursor(mdb.cursors.DictCursor)

    cur.execute("SET group_concat_max_len = 8192")
    cur.execute(sql)

    rows = cur.fetchall()

    print '[',
    for row in rows[:-1]:
      event = row['EVENT'].decode('utf-8', 'ignore')
      print '{%s},' % (event)
    print '{%s}' % (rows[-1]['EVENT'].decode('utf-8', 'ignore'))
    print ']',

    # for row in rows:
      # print '{%s},' % (row['EVENT'].decode('ascii', 'ignore'))

  except mdb.Error, e:

    print "Error %d: %s" % (e.args[0],e.args[1])
    sys.exit(1)

finally:

  if con:
    con.close()

# $con->query("SET group_concat_max_len = 8192");


# $sqlq = 'SELECT
  # `post_title`,
  # m.`meta_key`,
  # m.`meta_value`,
  # `post_content`,
  # `post_type`
  # FROM `wp_postmeta` AS m
  # INNER JOIN `wp_posts` AS p ON p.`ID`=m.`post_id` AND p.`post_status`="publish"
  # AND p.`post_status` =  "publish"
  # AND m.`meta_value` != ""
  # WHERE p.`ID` IN
  # (
  # SELECT m.`post_id` FROM `wp_postmeta` AS m
  # WHERE DATE_FORMAT(m.`meta_value`, "%Y%m%d")+0 >= CURRENT_DATE()+0
  # )
  # AND m.`meta_key` NOT REGEXP "^_"
  # AND m.`meta_value` NOT  LIKE "field%"';

# $all = "
  # SELECT
  # GROUP_CONCAT(
    # '\"'
    # , m.`meta_key`
    # , '\":\"'
    # , REPLACE(
        # REPLACE(
          # REPLACE(m.`meta_value`, char(34), '\\\\\"')
          # , char(13), '<br>'
        # ), char(10), ''
      # )
    # , '\"'
    # SEPARATOR ','
  # ) AS EVENT
  # FROM `wp_postmeta` AS m
  # WHERE m.`meta_value` IS NOT NULL
  # AND m.`meta_value` <> ''
  # AND m.`meta_value` NOT LIKE '%field%'
  # AND m.`meta_key` NOT LIKE '%field%'
  # AND m.`meta_key` NOT REGEXP '^_edit'
  # AND m.`meta_key` NOT REGEXP '^type_of_event'
  # AND m.`meta_key` NOT REGEXP '^_wp_attach'
  # GROUP BY m.`post_id`
  # ORDER BY m.`post_id` DESC
  # LIMIT 1000

# ";

# current = "
  # SELECT *
  # FROM `wp_postmeta` as m
  # RIGHT JOIN
  # (
    # SELECT innerp.`ID`
    # FROM `wp_posts` AS innerp
    # JOIN `wp_postmeta` AS innerm
    # ON innerp.`ID` = innerm.`post_id`
    # WHERE innerp.`post_type` = 'event'
    # AND innerp.`post_status` = 'publish'
    # AND innerm.`meta_key` = 'date_num'
    # AND innerm.`meta_value` >= UNIX_TIMESTAMP()
  # ) AS current
  # ON m.`post_id` = current.`ID`
# ";

# $working = "
  # SELECT
  # GROUP_CONCAT(
    # '\"'
    # , m.`meta_key`
    # , '\":\"'
    # , REPLACE(
        # REPLACE(
          # REPLACE(m.`meta_value`, char(34), '\\\\\"')
          # , char(13), '<br>'
        # ), char(10), ''
      # )
    # , '\"'
    # ORDER BY m.`meta_key`
    # SEPARATOR ','
  # ) AS EVENT
  # FROM `wp_postmeta` AS m
  # RIGHT JOIN
  # (
    # SELECT innerp.`ID`
    # FROM `wp_posts` AS innerp
    # JOIN `wp_postmeta` AS innerm
    # ON innerp.`ID` = innerm.`post_id`
    # WHERE innerp.`post_type` = 'event'
    # AND innerp.`post_status` = 'publish'
    # AND innerm.`meta_key` = 'date_num'
    # AND innerm.`meta_value` >= UNIX_TIMESTAMP()
  # ) AS current
  # ON m.`post_id` = current.`ID`
  # WHERE m.`meta_value` IS NOT NULL
  # AND m.`meta_value` <> ''
  # AND m.`meta_value` NOT LIKE '%field%'
  # AND m.`meta_key` NOT LIKE '%field%'
  # AND m.`meta_key` NOT REGEXP '^_edit'
  # AND m.`meta_key` NOT REGEXP '^type_of_event'
  # AND m.`meta_key` NOT REGEXP '^_wp_attach'
  # GROUP BY m.`post_id`
  # ORDER BY m.`post_id` DESC

# ";

# // Newly added title and published fields to wp_postmeta
# $sqld = '
  # SELECT p.`post_title`, m.*
  # FROM `wp_postmeta` AS m, `wp_posts` AS p
  # INNER JOIN
  # (
  # SELECT m.`post_id` FROM `wp_postmeta` AS m
  # WHERE m.`meta_key` = "date_num"
  # AND m.`meta_value` >= UNIX_TIMESTAMP()
  # ) AS id
  # ON p.`ID` = id.`post_id`
  # WHERE m.`meta_value` IS NOT NULL AND m.`meta_value` <> ""
  # AND m.`post_id` = p.`ID`
  # ';
# $sql = "
  # SELECT GROUP_CONCAT(
    # '\"', m.`meta_key`, '\":\"', m.`meta_value`,  '\"'
    # ORDER BY m.`meta_key`
    # SEPARATOR ','
  # ) AS EVENT
  # , REPLACE( m.`meta_value` , CHAR( 34 ) , CHAR( 39 ) ) AS REPLACEMENT
  # FROM `wp_postmeta` AS m
  # INNER JOIN
  # (
  # SELECT m.`post_id` FROM `wp_postmeta` as m
  # WHERE m.`meta_key` = 'date_num'
  # AND m.`meta_value` >= UNIX_TIMESTAMP()
  # ORDER BY m.`meta_value`
  # ) AS id
  # ON id.`post_id` = m.`post_id`
  # WHERE m.`meta_value` IS NOT NULL
  # AND m.`meta_value` <> ''
  # AND m.`meta_value` NOT  LIKE 'field%'
  # AND m.`meta_key` NOT REGEXP '^_edit'
  # AND m.`meta_key` NOT REGEXP '^type_of_event'
  # GROUP BY m.`post_id`
  # ORDER BY m.`post_id`
# ";

# $sql7 = "
# SELECT
# GROUP_CONCAT('\"', m.`meta_key`, '\":\"',
  # REPLACE(
    # REPLACE(
      # REPLACE(m.`meta_value`, char(34), '\\\\\"')
      # , char(13), '<br>'
    # ), char(10), ''
  # )
  # , '\"'
  # SEPARATOR ','
# ) AS EVENTS
# FROM `wp_postmeta` as m

  # INNER JOIN
  # (
  # SELECT m.`post_id` FROM `wp_postmeta` as m
  # WHERE m.`meta_key` = 'date_num'
  # AND m.`meta_value` >= UNIX_TIMESTAMP()
  # ORDER BY m.`meta_value`
  # ) AS id
  # ON id.`post_id` = m.`post_id`

# WHERE m.`meta_value` IS NOT NULL
# AND m.`meta_key` IS NOT NULL
# AND m.`meta_value` <> ''
# AND m.`meta_key` <> ''
# AND m.`meta_value` NOT  LIKE 'field%'
# AND m.`meta_key` NOT REGEXP '^_edit'
# AND m.`meta_key` NOT REGEXP '^type_of_event'
# AND m.`meta_key` NOT REGEXP '^_wp_attach'
# AND m.`meta_key` NOT REGEXP '^_dp_original'

# GROUP BY m.`post_id`
# ORDER BY `m`.`post_id`  DESC
# ";


# // AND m.`meta_key` NOT REGEXP "^_"
# //  AND m.`meta_value` <> ""

# //$t = time();
# $result = mysqli_query($con, $working) or die("Error @sql: " . mysqli_error($con));
# //$u = time();
# //$times = $times . "query: " . ($u-$t) . " ";
# $rows = array();
# $pattern = '/\r\n|\\r\\n|\\\r\\\n/';
# $replacement = '<br />';
# while ($row = mysqli_fetch_assoc($result)) {
    # $row_as_string = json_encode($row);
    # $cleanline = preg_replace($pattern, $replacement, trim($row_as_string));
    # $cleanrow = json_decode($cleanline);
    # $rows[] = $cleanrow;
    # // $rows[] = $cleanline;
# }
# $v = time();
# $times = $times . "fetch: " . ($v-$u) . " ";
# $data =  json_encode($rows) . $times . " ";
# $w = time();
# $times = $times . "jsonencode: " . ($w-$v) . " ";
# // foreach ($rows as $row) {
  # // foreach ($row as $r) {
    # // echo $r;
  # // }
# // };
# echo json_encode($rows);
# // echo $rows;
# // echo $times . "<br>" . json_encode($rows);