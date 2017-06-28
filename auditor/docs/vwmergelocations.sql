CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `vwmergelocations` AS
    select 
        `A`.`id` AS `id`,
        `A`.`id` AS `object_id`,
        `A`.`code` AS `code`,
        '' AS `license_plate`,
        `A`.`supplier_id` AS `supplier_id`,
        `A`.`type` AS `type`,
        `A`.`uuid` AS `uuid`,
        `A`.`start` AS `start`,
        `A`.`release` AS `release`,
        'locations' AS `table`,
        `P`.`name` AS `provider_name`
    from
        (`location` `A`
        left join `provider` `P` ON ((`P`.`id` = `A`.`supplier_id`)))
    where
        (`A`.`status` = 0) 
    union select 
        `A`.`id` AS `id`,
        `A`.`id` AS `object_id`,
        `A`.`code` AS `code`,
        `A`.`license_plate` AS `license_plate`,
        `A`.`supplier_id` AS `supplier_id`,
        `A`.`type` AS `type`,
        `A`.`uuid` AS `uuid`,
        '0000-00-00' AS `start`,
        '0000-00-00' AS `release`,
        'mobile' AS `table`,
        `P`.`name` AS `provider_name`
    from
        (`mobile` `A`
        left join `provider` `P` ON ((`P`.`id` = `A`.`supplier_id`)))
    where
        (`A`.`status` = 0)