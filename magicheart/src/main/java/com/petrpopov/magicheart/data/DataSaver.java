package com.petrpopov.magicheart.data;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * User: petrpopov
 * Date: 30.09.13
 * Time: 12:39
 */

@Component
public class DataSaver {

    volatile private Map<String, List<Pulse>> data = new HashMap<String, List<Pulse>>();
    //volatile private List<Pulse> data = new ArrayList<Pulse>();

    synchronized public void addData(PulseData someData) {

        String clientId = someData.getClientId();
        int pageNumber = someData.getPageNumber();

        List<Pulse> pulses;
        if( data.containsKey(clientId) ) {
            pulses = data.get(clientId);

            if( pageNumber == 0 )
                pulses = new ArrayList<Pulse>();
        }
        else {
            pulses = new ArrayList<Pulse>();
            data.put(clientId, pulses);
        }

        for (Pulse pulse : someData.getPulse()) {
            if( contains(pulse, clientId))
                continue;

            pulses.add(pulse);
        }
    }

    synchronized public List<Pulse> getData(String clientId) {

        List<Pulse> pulses = data.get(clientId);
        if( pulses != null )
            return pulses;

        return new ArrayList<Pulse>();
    }

    synchronized private boolean contains(Pulse pulse, String clientId) {

        if( !data.containsKey(clientId) )
            return false;

        for (Pulse p : data.get(clientId)) {
            if( p.getTimestamp().equals(pulse.getTimestamp())) {
                return true;
            }
        }

        return false;
    }
}
