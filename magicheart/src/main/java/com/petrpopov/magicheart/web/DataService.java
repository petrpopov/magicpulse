package com.petrpopov.magicheart.web;

import com.petrpopov.magicheart.data.DataSaver;
import com.petrpopov.magicheart.data.Pulse;
import com.petrpopov.magicheart.data.PulseData;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User: petrpopov
 * Date: 30.09.13
 * Time: 11:49
 */

@Controller
@RequestMapping("/data")
public class DataService {

    private Logger log = Logger.getLogger(DataService.class);

    @Autowired
    private DataSaver dataSaver;

    @RequestMapping(value="add", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public void addValue(@RequestBody PulseData pulseData) {

        log.info(pulseData);

        dataSaver.addData(pulseData);
    }

}
