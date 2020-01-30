import ip from "ip";
import fetch from "isomorphic-unfetch";

// TODO: (but not necessary) if using electron, set up ipc channels instead of going through network stack - it's more efficient.
// efficiency shouldn't be an issue though and simplicity is king right now. So just go through local loopback
const apiUrl = `http://${
  process.env.WEBPACK_TARGET === "electron-renderer"
    ? "localhost"
    : process.env.NODE_ENV === "development"
    ? ip.address()
    : process.env.GLOBAL_HOST
}:${process.env.SANIC_PORT}/`;

const fetchJson = (uri: string, opts = {}) =>
  fetch(apiUrl + uri, opts).then(res => res.json());

export const get = (uri: string) => fetchJson(uri);

export const post = (uri: string, data: object) =>
  fetchJson(uri, {
    method: "POST",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export class QmsData {
  // @ts-ignore 2564
  filename: string;
  // @ts-ignore 2564
  totalTime: number;
  // @ts-ignore 2564
  lapTimes: number[];
  // @ts-ignore 2564
  channels: Channel[];

  static download = async (filename: string): Promise<QmsData> => {
    const { totalTime, lapTimes, channels } = await get(`qms/${filename}`);
    const data = new QmsData();
    data.filename = filename;
    data.totalTime = totalTime;
    data.lapTimes = lapTimes;
    data.channels = channels;
    return data;
  };

  async hydrate_channels(channel_idxs: number[]) {
    await Promise.all(
      channel_idxs.map(async idx => {
        if (this.channels[idx].data === undefined) {
          this.channels[idx].data = await get(`qms/${this.filename}/${idx}`);
        }
      })
    );
  }
}

export type Channel = {
  name: string;
  freq: number;
  unit: string;
  data?: number[]; // undefined unless hydrated
};
