import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/first';

// Options to reproduce firestore queries consistently
interface QueryConfig {
  path: string, // path to collection
  field: string, // field to orderBy
  limit?: number, // limit per query
  reverse?: boolean, // reverse order?
  prepend?: boolean // prepend to source?
}


@Injectable()
export class SpotProvider {

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  // Observable data
  public data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();


  constructor(private afs: AngularFirestore) { }

  // Initial query sets options and defines the Observable
  init(path, field, opts?) {
    this.query = { 
      path,
      field,
      limit: 5,
      reverse: false,
      prepend: false,
      ...opts
    }

    const first = this.afs.collection(this.query.path, ref => {
      return ref.orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
          .limit(this.query.limit)
    })

    this.mapAndUpdate(first)

    // Create the observable array for consumption in components
    this.data = this._data.asObservable()
      .scan( (acc, val) => { 
        return this.query.prepend ? val.concat(acc) : acc.concat(val)
      })
  }

  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor()

    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor)
    })
    this.mapAndUpdate(more)
  }

  // Determines the doc snapshot to paginate query 
  private getCursor() {
    const current = this._data.value
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc 
    }
    return null
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {

    if (this._done.value || this._loading.value) { return };

    // loading
    this._loading.next(true)

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .do(arr => {
        
        let values = arr.map(snap => {
          const data = snap.payload.doc.data()
          data.id = snap.payload.doc.id
          const doc = snap.payload.doc
          return { ...data, doc }
        })
  
        // If prepending, reverse array
        values = this.query.prepend ? values.reverse() : values

        // load the spots
        let aPromises = [];
        for (let i in values) {
          let doc : any = values[i] ;
          aPromises.push(this.afs.doc(`fspots/${doc.id}`).valueChanges().first().toPromise().then(spot => {
            Object.assign(values[i], spot);
          }))
        }
        
        Promise.all(aPromises).then((params) => {
          // update source with new values, done loading
          this._data.next(values)
          this._loading.next(false)
  
          // no more values, mark done
          if (!values.length) {
            this._done.next(true)
          }
        })
    })
    .take(1)
    .subscribe()
  }


  // Reset the page
  reset() {
    this._data.next([])
    this._done.next(false)
  }
}