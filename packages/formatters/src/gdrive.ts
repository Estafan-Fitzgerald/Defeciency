import { ParsedStream } from '@aiostreams/types';
import { formatDuration, formatSize } from './utils';
import { serviceDetails } from '@aiostreams/utils';

export function gdriveFormat(stream: ParsedStream): {
  name: string;
  description: string;
} {
  let name: string = '';

  if (stream.provider) {  
    const cacheStatus = stream.provider.cached
      ? '⚡'
      : stream.provider.cached === undefined
        ? '❓'
        : '⏳';
    const serviceShortName = serviceDetails.find((service) => service.id === stream.provider!.id)?.shortName || stream.provider.id;
    name += `[${serviceShortName}${cacheStatus}]`;
  }

  if (stream.torrent?.infoHash) {
    name += `[P2P]`;
  }

  name += `${stream.addon.name} ${stream.resolution}`;

  let description: string = `${stream.quality !== 'Unknown' ? '🎥 ' + stream.quality + ' ' : ''}${stream.encode !== 'Unknown' ? '🎞️ ' + stream.encode : ''}`;

  if (stream.visualTags.length > 0 || stream.audioTags.length > 0) {
    description += ' ';

    description +=
      stream.visualTags.length > 0
        ? `📺 ${stream.visualTags.join(' | ')}   `
        : '';
    description +=
      stream.audioTags.length > 0 ? `🎧 ${stream.audioTags.join(' | ')}` : '';
  }
  if (stream.size || stream.torrent?.seeders || stream.usenet?.age) {
    description += '\n';

    description += `📦 ${formatSize(stream.size || 0)} `;

    description += stream.torrent?.seeders
      ? `👥 ${stream.torrent.seeders}`
      : '';

    description += stream.usenet?.age ? `📅 ${stream.usenet.age}` : '';
  }
  if (stream.languages.length !== 0 || stream.duration) {
    description += '\n';
    if (stream.duration) {
      description += `🕒 ${formatDuration(stream.duration)} `;
    }
    if (stream.languages.length !== 0) {
      description += `🔊 ${stream.languages.join(' | ')}`;
    }
  }

  description += `\n📄 ${stream.filename ? stream.filename : 'Unknown'}`;

  return { name, description };
}
