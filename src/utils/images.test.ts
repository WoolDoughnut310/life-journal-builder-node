import { retrieveImage } from './images';

test('retrieves from correct endpoint', () => {
    const url = retrieveImage('2023');
    expect(url).toEqual(expect.stringContaining('link.storjshare.io'));
});

test('returns empty string when `name` is undefined', () => {
    const url = retrieveImage();
    expect(url).toEqual('');
});
