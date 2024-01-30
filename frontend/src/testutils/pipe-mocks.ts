import { Pipe, PipeTransform } from "@angular/core";

export function mockPipe(options: Pipe, mockReturn: any = undefined): Pipe {
  const metadata: Pipe = { name: options.name };
  return <any>Pipe(metadata)(class MockPipe implements PipeTransform { 
      public transform = () => mockReturn; 
  });
}

// from https://stackoverflow.com/a/56701741