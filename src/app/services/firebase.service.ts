import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { Observable, Subscriber } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: "root"
})
export class FirebaseService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  observeEvent(location: string, event: firebase.database.EventType): Observable<firebase.database.DataSnapshot> {
    return new Observable<firebase.database.DataSnapshot>((subscriber: Subscriber<firebase.database.DataSnapshot>) => {
      const callback = (snapshot: firebase.database.DataSnapshot, siblingKey: string) => {
        subscriber.next(snapshot);
      };
      this.db.database.ref(location).on(event, callback, (err: firebase.FirebaseError) => {
        subscriber.error(err);
      });
      return () => {
        this.db.database.ref(location).off(event, callback);
      };
    });
  }

  subscribeToEvent(location, event, callback) {
    this.db.database.ref(location).on(event, (snapshot, prevChildKey) => {
      callback(snapshot.ref, snapshot.val(), snapshot.key, prevChildKey);
    }, (err) => {
      callback();
    });
  }

  unsubscribeFromEvent(location, event) {
    if (event) {
      this.db.database.ref(location).off(event);
    } else {
      this.db.database.ref(location).off();
    }
  }

  once(location, event, callback) {
    this.db.database.ref(location).once(event, (snapshot) => {
      callback(snapshot.ref, snapshot.val(), snapshot.key);
    }, (err) => {
      callback(null, null, null, err);
    });
  }

  set(location, data, callback) {
    this.db.database.ref(location).set(data)
      .then(() => {
        if (callback) {
          callback();
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  }

  update(location, data, callback) {
    this.db.database.ref(location).update(data)
      .then(() => {
        if (callback) {
          callback();
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  }

  remove(location, callback) {
    this.db.database.ref(location).remove()
      .then(() => {
        if (callback) {
          callback();
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  };

  transaction(location, callback) {
    this.db.database.ref(location).transaction((data) => {
      return callback(data);
    });
  };
}
