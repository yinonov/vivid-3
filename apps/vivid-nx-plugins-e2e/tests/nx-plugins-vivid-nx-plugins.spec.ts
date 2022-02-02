import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-plugins-vivid-nx-plugins e2e', () => {
  it('should create nx-plugins-vivid-nx-plugins', async () => {
    const plugin = uniq('nx-plugins-vivid-nx-plugins');
    ensureNxProject(
      '@vivid-nx/vivid-nx-plugins',
      'dist/libs/nx-plugins/vivid-nx-plugins'
    );
    await runNxCommandAsync(
      `generate @vivid-nx/vivid-nx-plugins:nx-plugins-vivid-nx-plugins ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('nx-plugins-vivid-nx-plugins');
      ensureNxProject(
        '@vivid-nx/vivid-nx-plugins',
        'dist/libs/nx-plugins/vivid-nx-plugins'
      );
      await runNxCommandAsync(
        `generate @vivid-nx/vivid-nx-plugins:nx-plugins-vivid-nx-plugins ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('nx-plugins-vivid-nx-plugins');
      ensureNxProject(
        '@vivid-nx/vivid-nx-plugins',
        'dist/libs/nx-plugins/vivid-nx-plugins'
      );
      await runNxCommandAsync(
        `generate @vivid-nx/vivid-nx-plugins:nx-plugins-vivid-nx-plugins ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
