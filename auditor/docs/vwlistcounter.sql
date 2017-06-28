CREATE 
	ALGORITHM = UNDEFINED 
	DEFINER = `root`@`localhost` 
	SQL SECURITY DEFINER
VIEW `vwlistcounter` AS
	(select 
		`B`.`id` AS `id`,
		`B`.`uuid` AS `uuid`,
		`B`.`account_id` AS `account_id`,
		`B`.`supplier_id` AS `supplier_id`,
		`B`.`campaing_id` AS `campaing_id`,
		`B`.`list_id` AS `list_id`,
		`B`.`code` AS `code`,
		`B`.`coords` AS `coords`,
		`B`.`lng` AS `lng`,
		`B`.`lat` AS `lat`,
		`B`.`light` AS `light`,
		`B`.`price` AS `price`,
		`B`.`total` AS `total`,
		`B`.`tax` AS `tax`,
		`B`.`ammount` AS `ammount`,
		`B`.`contra` AS `contra`,
		`B`.`base` AS `base`,
		`B`.`height` AS `height`,
		`B`.`size` AS `size`,
		`B`.`dimensions` AS `dimensions`,
		`B`.`material` AS `material`,
		`B`.`street` AS `street`,
		`B`.`neighbor` AS `neighbor`,
		`B`.`ref_street_1` AS `ref_street_1`,
		`B`.`ref_street_2` AS `ref_street_2`,
		`B`.`zip` AS `zip`,
		`B`.`city` AS `city`,
		`B`.`state` AS `state`,
		`B`.`type` AS `type`,
		`B`.`view_type` AS `view_type`,
		`B`.`active` AS `active`,
		`B`.`start` AS `start`,
		`B`.`release` AS `release`,
		`B`.`created` AS `created`,
		`B`.`createdAt` AS `createdAt`,
		`B`.`updatedAt` AS `updatedAt`,
		`B`.`status` AS `status`,
		`B`.`subtype` AS `subtype`,
		`B`.`phase` AS `phase`,
		`B`.`license_plate` AS `license_plate`,
		`B`.`line` AS `line`,
		`B`.`route` AS `route`,
		`B`.`sector` AS `sector`,
		`B`.`station` AS `station`,
		`B`.`place` AS `place`,
		`B`.`format` AS `format`,
		`B`.`tren` AS `tren`,
		`B`.`vagon` AS `vagon`,
		`B`.`structure` AS `structure`,
		`B`.`qty` AS `qty`,
		`B`.`comments` AS `comments`,
		`B`.`segment` AS `segment`,
		`B`.`version` AS `version`
	from
		(`vwlocationgroup` `L`
		left join `location` `B` ON (((`L`.`supplier_id` = `B`.`supplier_id`)
			and (`L`.`list_id` = `B`.`list_id`)
			and (`B`.`release` >= now ()))))
	where
		(`B`.`type` is not null))