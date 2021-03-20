import { Server } from "../entities/Server";

export function parseServerJSON(arr: Server[]): Server[] {
  arr.map((item) => {
    item.textChannels = item.textChannels.map((channel) =>
      JSON.parse((channel as unknown) as string)
    );
  });
  return arr;
}
