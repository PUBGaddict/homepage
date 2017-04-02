import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class MapData {
  dataDefusal: any;
  dataHostage: any;
  private mapCache: any = {};

  constructor(public http: Http) { }

  private loadDefusalMaps(): any {
    if (this.dataDefusal) {
      return Observable.of(this.dataDefusal);
    } else {
      return this.http.get('https://csgospots-1f294.firebaseio.com/de_maps.json')
        .map(this.processDefusalMaps);
    }
  }

  private loadHostageMaps(): any {
    if (this.dataHostage) {
      return Observable.of(this.dataHostage);
    } else {
      return this.http.get('https://csgospots-1f294.firebaseio.com/cs_maps.json')
        .map(this.processHostageMaps);
    }
  }

  getDefusalMaps() {
    return this.loadDefusalMaps().map((data: any) => {
      return data;
    });
  }

  getHostageMaps() {
      return this.loadHostageMaps().map((data: any) => {
        return data;
      });
  }

  processDefusalMaps (data: any) {
    this.dataDefusal = data;
    return this.dataDefusal.json();
  }
  processHostageMaps (data: any) {
    this.dataHostage = data;
    return this.dataHostage.json();
  }

  private loadMap(mapname: string): Observable<any> {
    if (this.mapCache[mapname]) {
      return Observable.of(this.mapCache[mapname]);
    } else {
      return this.http.get('https://firebasestorage.googleapis.com/v0/b/csgospots-1f294.appspot.com/o/'  + mapname + '.json?alt=media&token=5fd55cc3-ed0e-4862-a275-2804bc9b2c77')
        .map(this.processMapData.bind(this));
    }
  }

  processMapData (data: any) {
    let map = data.json();
    this.mapCache[map.mapname] = map;
    return map || { };
  }
     
  getMap(mapname: string) : Observable<any> {
    return this.loadMap(mapname);
  }
  
  getIntentionFromMap (map: any, intentionName: string) {
    if (!map || !intentionName) {
      return;
    }

    if (!!map[intentionName]) {
      return map[intentionName];
    }
    return {};
  }

  getStrategyFromIntention (intention: any, strategyId: string) {
    if (!intention || !strategyId) {
      return {};
    }

    for (let strategy of intention) {
      if (strategy.id === strategyId) {
        return strategy;
      }
    }
    return {};
  }

  getSpotFromStrategy (strategy: any, spotId: string) {
    if (!strategy || !spotId) {
      return {};
    }

    for (let spot of strategy.spots) {
      if (spot.id === spotId) {
        return spot;
      }
    }
    return {};
  }


  /*processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data.json();

    this.data.tracks = [];

    // loop through each day in the schedule
    this.data.schedule.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each session in the timeline group
        group.sessions.forEach((session: any) => {
          session.speakers = [];
          if (session.speakerNames) {
            session.speakerNames.forEach((speakerName: any) => {
              let speaker = this.data.speakers.find((s: any) => s.name === speakerName);
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }

          if (session.tracks) {
            session.tracks.forEach((track: any) => {
              if (this.data.tracks.indexOf(track) < 0) {
                this.data.tracks.push(track);
              }
            });
          }
        });
      });
    });

    return this.data;
  }

  getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
    return this.load().map((data: any) => {
      let day = data.schedule[dayIndex];
      day.shownSessions = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      day.groups.forEach((group: any) => {
        group.hide = true;

        group.sessions.forEach((session: any) => {
          // check if this session should show or not
          this.filterSession(session, queryWords, excludeTracks, segment);

          if (!session.hide) {
            // if this session is not hidden then this group should show
            group.hide = false;
            day.shownSessions++;
          }
        });

      });

      return day;
    });
  }

  filterSession(session: any, queryWords: string[], excludeTracks: any[], segment: string) {

    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segement is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakers() {
    return this.load().map((data: any) => {
      return data.speakers.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getTracks() {
    return this.load().map((data: any) => {
      return data.tracks.sort();
    });
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }*/

}
