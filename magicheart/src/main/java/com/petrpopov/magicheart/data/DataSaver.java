package com.petrpopov.magicheart.data;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * User: petrpopov
 * Date: 30.09.13
 * Time: 12:39
 */

@Component
public class DataSaver {

    volatile private List<Pulse> data = new ArrayList<Pulse>();

    synchronized public void addData(PulseData someData) {

        for (Pulse pulse : someData.getPulse()) {
            if( contains(pulse))
                continue;

            if(data.size() <= 2048)
                data.add(pulse);
            else
                data = new ArrayList<Pulse>();
        }
    }

    synchronized public List<Pulse> getData() {

        if( data != null )
            return data;

        return new ArrayList<Pulse>();
    }

    synchronized private boolean contains(Pulse pulse) {

        for (Pulse p : data) {
            if( p.getTimestamp().equals(pulse.getTimestamp())) {
                return true;
            }
        }

        return false;
    }
}
