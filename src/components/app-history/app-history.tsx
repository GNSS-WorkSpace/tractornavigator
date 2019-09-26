import { Component, h, Prop, State } from '@stencil/core';
import { Store } from "@stencil/redux";


@Component({
  tag: 'app-history',
  styleUrl: 'app-history.css'
})
export class AppHistory {

  @State() recordings: Array<any>

  @Prop({ context: "store" }) store: Store;

  componentWillLoad() {
    this.store.mapStateToProps(this, state => {
      const {
        history: { recordings }
      } = state;
      return {
        recordings
      };
    });

    this.store.mapDispatchToProps(this, {
    });
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/" />
          </ion-buttons>
          <ion-title>History</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <ion-list>
          {this.recordings.map((recording, index) =>
            <ion-item key={index}> 
              <ion-thumbnail slot="start">
                <img src="/assets/field-vignette.png" />
              </ion-thumbnail>
              <ion-label>
                <h3>TODO</h3>
                <p>{recording.dateStart} | TODO km</p>
              </ion-label>
              <ion-button 
                slot="end"
                onClick={() => console.log('todo')}
              >
                  <ion-icon name="play" slot="end"></ion-icon>
                Continue
              </ion-button>
            </ion-item>
          )}
          {/* <ion-item-divider>
            <ion-label>
              Finished fields
            </ion-label>
          </ion-item-divider>
          {finishedTracks.map((item, index) =>
            <ion-item key={index}> 
              <ion-thumbnail slot="start">
                <img src="/assets/field-vignette.png" />
              </ion-thumbnail>
              <ion-label>
                <h3>{item.name}</h3>
                <p>{item.date} | {item.length}km</p>
              </ion-label>
              <ion-button 
                slot="end" 
                color="medium"
                onClick={() => console.log('todo')}
              >
                  <ion-icon name="refresh" slot="end"></ion-icon>
                Reload
              </ion-button>
            </ion-item>
          )} */}
        </ion-list>
      </ion-content>
    ];
  }
}
