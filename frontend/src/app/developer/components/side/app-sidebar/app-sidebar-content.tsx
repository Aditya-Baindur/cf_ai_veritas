'use client'

import React from 'react'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion'
import { Button } from '../../ui/button'
import { ExternalLink, GitBranch, LayoutGrid } from 'lucide-react'

export default function AppSidebarContent() {
  return (
    <section className="flex flex-col gap-3 px-1">
      {/* Primary Action */}
      <Link href="/dashboard">
        <Button
          className="w-full justify-center rounded-2xl font-medium"
          variant="outline"
        >
          General Query?
        </Button>
      </Link>

      {/* Contextual Info */}
      <Accordion
        type="multiple"
        defaultValue={['about', 'ecosystem']}
        className="w-full"
      >
        {/* About the system */}
        <AccordionItem value="about">
          <AccordionTrigger className="text-sm">
            About This System
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col">
              <Button asChild variant="ghost" className="justify-start gap-2">
                <Link href="/">
                  <LayoutGrid className="h-4 w-4" />
                  Landing / Home
                </Link>
              </Button>

              <Button asChild variant="ghost" className="justify-start gap-2">
                <Link href="/github">
                  <GitBranch className="h-4 w-4" />
                  Source Code
                </Link>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cloudflare + Labs */}
        <AccordionItem value="ecosystem">
          <AccordionTrigger className="text-sm">
            Ecosystem & Labs
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col">
              <Button asChild variant="ghost" className="justify-start gap-2">
                <Link href="/#architecture">
                  <LayoutGrid className="h-4 w-4" />
                  Cloudflare Architecture
                </Link>
              </Button>

              <Button asChild variant="ghost" className="justify-start gap-2">
                <Link
                  href="https://vicilabs.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  ViciLabs — Experiments
                </Link>
              </Button>

              <Button asChild variant="ghost" className="justify-start gap-2">
                <Link
                  href="https://www.adityabaindur.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Developer Profile
                </Link>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
