import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';

const url = `https://twofa-example-api.onrender.com/`; // Replace with your Render URL
const interval = 200000; // Interval in milliseconds (5 minutes)

@Injectable()
export class SpinUpService implements OnModuleInit {
  onModuleInit() {
    setInterval(this.reloadWebsite, interval);
  }

  reloadWebsite() {
    axios
      .get(url)
      .then((response) => {
        console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
      })
      .catch((error) => {
        console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
      });
  }
}
