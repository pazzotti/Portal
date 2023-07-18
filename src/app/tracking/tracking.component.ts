import { AfterViewInit, Component } from '@angular/core';
import { ApiService } from '../services/contratos/contratos.service';
import { AppModule } from '../app.module';
import mapboxgl, { Popup } from 'mapbox-gl';





@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})



  export class TrackingComponent implements AfterViewInit {
    ngAfterViewInit(): void {
      const apiKey = 'v1.public.eyJqdGkiOiJiZjA5NjY4MS1lNjBlLTQ3NjEtODE1NS04MTA3N2VlMWNiNTEifTeO-jM5cgo2q0aCF5-5CtyFzHJCmiVFTtMvb63TqPuCgRHzgAp4fToOmh0qi5GP6zsNF3cyXkeoOiwBfyDC4zsU6QO-xzjHHzG3tZ19VBwVDnE49556GGEsA-nkfhLgM64WzpJNt_v2C8sZfbl_Pr4EabQDnz8--1r6pe4qcbN4wwpZetb6RxwGfjIkSxSLshpqGCvUSISrzS3jrxhOkp_mbOBx-L8jumjc8YT3NTsmvPS0sdEGmDk5516PX4wRBwHR_Ry2wlbbfq-gH5AMkNZb28KhyVVGezJ3HNhV32FlOPfrbmEovAa-s2DOUZBR00MkZW8wIPgpter9ihwFs5c.ZTA0NDFlODYtNGY5Mi00NWU4LTk1MDgtMmY4YmViYWFhYjUz';
      const mapName = 'Tracking_Karrara_Claro';
      const region = 'sa-east-1';

      mapboxgl.accessToken = apiKey;

      const map = new mapboxgl.Map({
        container: 'map',
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
        center: [-123.115898, 49.295868],
        zoom: 11
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    }
  }
