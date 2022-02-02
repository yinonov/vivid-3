import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('vivid-nx-plugins e2e', () => {
  it('should create vivid-components', async () => {
    const plugin = uniq('vivid-component');
    ensureNxProject(
      '@vonage/vivid-nx-plugins',
      'dist/libs/nx-plugins/vivid-nx-plugins'
    );
    await runNxCommandAsync(
      `generate @vonage/vivid-nx-plugins:vivid-component ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  // describe('--directory', () => {
  //   it('should create src in the specified directory', async () => {
  //     const plugin = uniq('nx-plugins-vivid-nx-plugins');
  //     ensureNxProject(
  //       '@vivid-nx/vivid-nx-plugins',
  //       'dist/libs/nx-plugins/vivid-nx-plugins'
  //     );
  //     await runNxCommandAsync(
  //       `generate @vivid-nx/vivid-nx-plugins:nx-plugins-vivid-nx-plugins ${plugin} --directory subdir`
  //     );
  //     expect(() =>
  //       checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
  //     ).not.toThrow();
  //   }, 120000);
  // });
});
